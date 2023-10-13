import { useEffect, useMemo, useRef, useState } from 'react'
import { NextSeo } from 'next-seo'
import { v4 as uuid } from 'uuid'
import LoadingGames from '@/components/Loadings/LoadingGames'
import { useOptix } from '@/hooks/useOptix'
import { useGoogleTagManager } from '@/hooks/useGoogleTagManager'
import dayjs from 'dayjs'
import { useAuth } from '@/hooks/useAuth'
import { useCasino } from '@/hooks/useCasino'
import useWindowSize from '@/hooks/UseWindowSize'
import { LIVE_DATA_SOURCE, DATA_SOURCE } from 'constants/casino'
import Image from 'next/image'
import { Game } from 'types/casino'
import convertStaticUrl from '@/utils/convertStaticUrl'
import PlayerApi from 'services/PlayerApi'
import { doToast } from '@/utils/toastOptions'
import { toast } from 'react-toastify'
import { Favorite } from '@/components/Casino/Favorite'
import { Button } from 'design-system/button'
import { ArrowLeftIcon } from '@heroicons/react/20/solid'
import { useRouter } from 'next/router'

export function Game({ game }: { game: Game }) {
  const [gameCategory, setGameCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [gameLocation, setGameLocation] = useState('')
  const iframe = useRef(null)
  const { tracker } = useOptix()
  const { setDataLayer } = useGoogleTagManager()
  const { sessionId, isLogged, userId } = useAuth()
  const { gameLocationIndex, isCasinoLive, mutateFavorites, isGameFavorite } =
    useCasino()
  const { back } = useRouter()

  const isLive = useMemo(() => game.type.includes('live'), [])

  const { isMobile } = useWindowSize()

  const isFavorite = useMemo(() => {
    return isGameFavorite(game.name)
  }, [game, isGameFavorite])

  const [favorite, setFavorite] = useState(isFavorite)

  const gamePlayOptixEvent = () => {
    return tracker('GAME_PLAY', {
      event_type: 'gaming',
      event_uuid: uuid(),
      event_datetime: dayjs().format(),
      event_info_1: game.slug,
      event_info_2: game.name,
      event_info_3: gameCategory,
      userid: userId,
      event_ref_id: game.id,
      event_ref_type: game.id,
      event_ccy: 'BRL',
      event_language: 'pt-BR',
      event_location: gameLocation,
      event_location_index: String(gameLocationIndex),
      event_channel: isMobile ? 'mobile' : 'desktop',
    })
  }

  const openGameDataLayer = () => {
    const EVENT_NAME = 'open-casino-game'
    setDataLayer({
      event: EVENT_NAME,
      game: {
        id: game.id,
        name: game.name,
        slug: game.slug,
        category: gameCategory,
        live: isCasinoLive,
      },
      user: {
        id: userId,
      },
    })
  }

  const frameLoad = () => {
    setLoading(false)
    gamePlayOptixEvent()
    openGameDataLayer()
  }

  async function openFullscreen() {
    const element = iframe.current

    try {
      if (element?.requestFullscreen) {
        await element.requestFullscreen()
      } else if (element?.webkitRequestFullscreen) {
        await element.webkitRequestFullscreen() /* Safari */
      } else if (element?.msRequestFullscreen) {
        await element.msRequestFullscreen() /* IE11 */
      }
    } catch (e) {
      console.log('error fullscreen')
    }
  }

  const gameUrl = useMemo(() => {
    const gameLanguage = 'pt'
    const baseCasinoUrl = 'https://lendasbet.com/cassino'
    const depositQueryParam = 'om=deposit'
    const accountHistoryUrl = 'https://lendasbet.com/account'

    const encodedCasinoUrl = encodeURI(baseCasinoUrl)
    const encodedDepositUrl = encodeURI(`${baseCasinoUrl}?${depositQueryParam}`)
    const encodedAccountHistoryUrl = encodeURI(accountHistoryUrl)

    const sessionParam = isLogged && sessionId ? `_sid=${sessionId}&` : ''
    const queryParamSeparator = game?.launchUrl?.includes('?') ? '&' : '?'

    if (!game?.launchUrl) return null

    const finalUrl = `${game.launchUrl}${queryParamSeparator}${sessionParam}language=${gameLanguage}&casinolobbyurl=${encodedCasinoUrl}&cashierurl=${encodedDepositUrl}&accounthistoryurl=${encodedAccountHistoryUrl} `

    return finalUrl
  }, [game, sessionId, isLogged])

  const handleFavorites = async (currentChecked) => {
    try {
      if (currentChecked) {
        doToast('Jogo removido dos favoritos!', {
          position: toast.POSITION.TOP_CENTER,
        })
        await PlayerApi.delete(`/${userId}/favorites/${game.id}`)
        mutateFavorites()
        return
      }
      doToast('Jogo adicionado aos favoritos!', {
        position: toast.POSITION.TOP_CENTER,
      })
      await PlayerApi.put(`/${userId}/favorites`, {
        items: [game.id],
      })
      mutateFavorites()
    } catch (error) {
      console.error(error)
    }
  }

  const backgroundImage = convertStaticUrl(game.backgroundImageUrl)

  useEffect(() => {
    setFavorite(isFavorite)
    if (game?.categories) {
      const category = game?.categories?.items[0]

      const gameCategoryValue = category.id
        ? category.id
        : category.href.split('categories/')[1].split('?')[0]

      setGameCategory(gameCategoryValue)
    }

    const toggleSourceGames = isLive ? LIVE_DATA_SOURCE : DATA_SOURCE

    if (game?.groups) {
      const gameLocationValue = game?.groups?.items
        .filter((item) => item.includes(toggleSourceGames))[0]
        ?.split('$')[1]
      setGameLocation(gameLocationValue)
    }
  }, [game, isFavorite, isLive])

  return (
    <div className="relative w-full h-full">
      <NextSeo title={game.name} />
      <Image
        src={backgroundImage}
        alt="background do jogo"
        width={500}
        height={500}
        className="absolute inset-0 hidden object-cover w-full h-full sm:inline"
      />
      <div className="relative flex flex-col items-center justify-center w-full h-full mx-auto overflow-hidden max-w-7xl shadow-primary/20 lg:py-10">
        {loading && (
          <div className="absolute inset-0 w-full h-screen sm:h-full lg:py-10">
            <LoadingGames />
          </div>
        )}

        <div className="flex flex-col w-full h-full border border-borderColor">
          <div
            data-hidden={loading}
            className="relative flex w-full items-center justify-between bg-secondary p-2 data-[hidden=true]:hidden lg:items-center lg:rounded-t-lb lg:px-4"
          >
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="small" onClick={back}>
                <ArrowLeftIcon className="w-4 h-4 text-primary" />
              </Button>
              <div className="flex items-center space-x-2">
                <h2 className="w-auto max-w-[200px] truncate text-sm text-white lg:text-lg">
                  {game.name}
                </h2>
                <Favorite checked={favorite} onClick={handleFavorites} />
              </div>
            </div>
            <Image
              src="/icons/fullscreen.svg"
              onClick={() => openFullscreen()}
              width={8}
              height={8}
              alt="tela cheia"
              className="w-6 h-6 cursor-pointer hover:scale-105"
            />
          </div>
          {gameUrl && (
            <iframe
              id="gameModalIframe"
              ref={iframe}
              onLoad={frameLoad}
              src={gameUrl}
              className="h-screen w-full overflow-hidden border-none sm:h-[750px] sm:rounded-b-lb"
              allowFullScreen={true}
            ></iframe>
          )}
        </div>
      </div>
    </div>
  )
}
