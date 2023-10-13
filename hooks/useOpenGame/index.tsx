import { useRouter } from 'next/router'
import { useCasino } from 'hooks/useCasino'
import { useFetch } from 'hooks/useFetch'
import { useEffect } from 'react'
import { useModal } from '../useModal'
import { useAuth } from '../useAuth'
import Cookies from 'js-cookie'

export function useOpenGame(slug = null) {
  const { query } = useRouter()
  const { handleOpenModalLogin } = useModal()
  const { isLogged } = useAuth()
  const { setOpenModalGame, setCasinoGameActive } = useCasino()

  const gameSlug = slug ?? query?.game

  const searchGameBySlugURL = gameSlug
    ? `${process.env.NEXT_PUBLIC_CASINO_API_URL}/games?filter=slug%3D${gameSlug}&language=pt&orderBy=DES&selectedCountryCode=BR`
    : null

  const { data: gameData } = useFetch(searchGameBySlugURL)

  useEffect(() => {
    Cookies.set('game_slug', gameSlug)

    const hasGame = gameData?.items?.length > 0

    if (hasGame && isLogged) {
      setOpenModalGame(true)
      setCasinoGameActive(gameData.items[0])
    }

    const timer = setTimeout(() => {
      if (!isLogged && gameSlug) {
        handleOpenModalLogin()
      }
    }, 1500)

    return () => clearTimeout(timer)
  }, [gameData, setCasinoGameActive, setOpenModalGame, isLogged])

  return null
}
