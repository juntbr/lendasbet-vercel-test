import { ComponentProps, memo, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import Image from 'next/image'
import { Game } from 'types/casino'
import { useAuth } from 'hooks/useAuth'
import { useCasino } from 'hooks/useCasino'
import { doToast } from 'utils/toastOptions'
import PlayerApi from '../../services/PlayerApi'
import { Favorite } from './Favorite'
import convertStaticUrl from 'utils/convertStaticUrl'
import { useTranslation } from 'next-i18next'
import { PlayIcon } from '@heroicons/react/20/solid'
import { toast } from 'react-toastify'
import { useModal } from '@/hooks/useModal'
import { Button } from 'design-system/button'

interface GameGridItemProps extends ComponentProps<'button'> {
  game: Game
  index?: number
  highligth?: boolean
  setIsHover?: any
}

function Game({ game, index, highligth, setIsHover }: GameGridItemProps) {
  const { t } = useTranslation(['common'])
  const { isGameFavorite, mutateFavorites, openCasinoGame } = useCasino()

  const isFavorite = useMemo(() => {
    return isGameFavorite(game.name)
  }, [game, isGameFavorite])

  const [favorite, setFavorite] = useState(isFavorite)

  const { isLogged, userId } = useAuth()
  const { handleOpenModalLogin } = useModal()

  const thumbnail = convertStaticUrl(game?.defaultThumbnail)

  const getGameIfHaventId = async (slug) => {
    const searchGameBySlugURL = `${process.env.NEXT_PUBLIC_CASINO_API_URL}/games?filter=slug%3D${slug}&language=pt&orderBy=DES&selectedCountryCode=BR`
    const { data } = await axios.get(searchGameBySlugURL)
    return data.items[0].id
  }

  const handleFavorites = async (currentChecked) => {
    const messageErro =
      'Para que você possa favoritar seus jogos, é preciso fazer o login!'

    if (!isLogged) {
      handleOpenModalLogin()
      return doToast(messageErro, {
        position: toast.POSITION.TOP_CENTER,
      })
    }

    // A property that not exist in optimove
    const gameWithId = game.backgroundImageUrl

    let gameId = game.id
    if (!gameWithId) {
      gameId = await getGameIfHaventId(game.slug)
    }

    try {
      if (currentChecked) {
        doToast('Jogo removido dos favoritos!', {
          position: toast.POSITION.TOP_CENTER,
        })
        setFavorite(false)
        await PlayerApi.delete(`/${userId}/favorites/${gameId}`)
        mutateFavorites()
        return
      }
      doToast('Jogo adicionado aos favoritos!', {
        position: toast.POSITION.TOP_CENTER,
      })
      setFavorite(true)
      await PlayerApi.put(`/${userId}/favorites`, {
        items: [gameId],
      })
      mutateFavorites()
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    setFavorite(isFavorite)
  }, [isFavorite])

  function extractSlugFromUrl(url: string) {
    const urlWithoutQueryStringFromLiveGames = url?.split('/?')[0]
    const parts = urlWithoutQueryStringFromLiveGames?.split('/')
    return parts[parts.length - 1]
  }
  const slug = useMemo(
    () => (game.slug ? game.slug : extractSlugFromUrl(game?.launchUrl)),
    [game],
  )

  return (
    <div
      className="relative cursor-pointer keen-slider__slide group"
      onMouseMove={() => setIsHover && setIsHover(true)}
      onMouseLeave={() => setIsHover && setIsHover(false)}
    >
      <Image
        onClick={() => openCasinoGame(slug, index)}
        width={250}
        height={200}
        data-highligth={highligth}
        className="h-[100px] rounded-lb object-cover filter transition ease-in-out group-hover:scale-110 group-hover:brightness-25 data-[highligth=true]:h-[200px] data-[highligth=true]:sm:h-[300px] lg:h-[150px] lg:duration-500"
        src={thumbnail ?? '/images/defaultThumbnail.png'}
        loading="eager"
        priority={index <= 1}
        title={game.name}
        fetchPriority="high"
        alt={game.name}
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPkFpGqBwABJQC6jBTrXAAAAABJRU5ErkJggg=="
      />

      <div className="absolute z-10 items-center justify-center hidden w-full bottom-2/4 top-2/4 group-hover:flex">
        <Button
          onClick={() => openCasinoGame(slug, index)}
          endIcon={<PlayIcon className="w-4 h-4 mb-1 text-background" />}
        >
          {t('Play')}
        </Button>
      </div>
      <div className="flex-start absolute left-1 top-1 z-10 flex rounded-full bg-background/80 p-1.5 shadow-2xl group-hover:flex lg:hidden">
        <Favorite checked={favorite} onClick={handleFavorites} />
      </div>
    </div>
  )
}

export const GameGridItem = memo(Game)
