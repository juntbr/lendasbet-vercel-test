import axios from 'axios'
import { DATA_SOURCE, LIVE_DATA_SOURCE } from 'constants/casino'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Banner } from 'server/usecases/cassino/banners/types'
import useSWR from 'swr'
import { Game, GameCategory } from 'types/casino'
import { FavoritesResponse } from 'types/player'
import { useModal } from '../useModal'
import { useAuth } from '../useAuth'
import Cookies from 'js-cookie'
import { playerApiFetch } from 'services/PlayerApi'
import { useFetch } from '../useFetch'
import { useRouter } from 'next/router'
import { getGamesToCurrentPlatform } from 'utils/getGamesToCurrentPlatform'
import { useGoogleTagManager } from '../useGoogleTagManager'
import { AppContext } from 'contexts/context'
import { useIntelligentLayouts } from '../useOptix/useIntelligentLayouts'

interface CasinoContextValue {
  activeCasino: string
  setActiveCasino: (value: string) => void
  activeCasinoVendorFilter: number
  setActiveCasinoVendorFilter: (value: number) => void
  activeCasinoVendor: string
  setActiveCasinoVendor: (value: string) => void
  activeLiveCasino: string
  setActiveLiveCasino: (value: string) => void
  dataSource: string
  setDataSource: (value: string) => void
  isDropdownOpenMorePlayed: boolean
  setIsDropdownOpenMorePlayed: (value: boolean) => void
  treatedFavorites: any
  setTreatedFavorites: (value: any) => void
  isCasinoLive: boolean
  setCasinoLive: (value: boolean) => void
  changeGameCurrentCategory: any
  groupGames: any
  optimizedGroupGames: any
  setGroupGames: (value: any) => void
  gameTypeSidebar: any
  setGameTypeSidebar: (value: any) => void
  categoriesWithAllGamesCategory: any
  filteredGamesByCategory: any
  gameLocationIndex: number
  setGameLocationIndex: (value: number) => void
  setBanners: (banners: Banner[]) => void
  banners: Banner[]
  handleFavoritesClick: (game: Game, checked: boolean) => void
  isGameFavorite: (gameName: string) => boolean
  openCasinoGame: (game: Game) => void
  mutateFavorites: any
}

const CasinoContext = createContext<CasinoContextValue>(null)

export const ALL_GAMES_NAME = 'Ver tudo'
export const ALL_GAMES_ID = 'HIGHLIGHTED'
export const ALL_VENDORS = 'Provedores'
export const NONE_VENDOR = 'NONE'

export const CasinoProvider = ({ children }) => {
  const [activeCasinoVendorFilter, setActiveCasinoVendorFilter] = useState(0)

  const [activeCasino, setActiveCasino] = useState(ALL_GAMES_NAME)
  const [activeCasinoVendor, setActiveCasinoVendor] = useState(NONE_VENDOR)
  const [activeLiveCasino, setActiveLiveCasino] = useState(ALL_GAMES_NAME)
  const [dataSource, setDataSource] = useState(DATA_SOURCE)
  const [isDropdownOpenMorePlayed, setIsDropdownOpenMorePlayed] = useState(true)
  const [treatedFavorites, setTreatedFavorites] = useState<FavoritesResponse>()

  const [gameTypeSidebar, setGameTypeSidebar] = useState(null)
  const [isCasinoLive, setCasinoLive] = useState(false)
  const [gameLocationIndex, setGameLocationIndex] = useState(null)

  const { isLogged, userId } = useAuth()

  const fetcher = (url: string) => axios.get(url).then((res) => res.data)
  const { data: banners } = useSWR<Banner[]>('/api/casino/banners', fetcher)

  const { data: favorites, mutate: mutateFavorites } =
    useSWR<FavoritesResponse>(
      isLogged && userId !== null && `/${userId}/favorites`,
      playerApiFetch,
    )

  useEffect(() => {
    setTreatedFavorites(favorites)
  }, [favorites, setTreatedFavorites])

  const DATA_LIVE_OR_SLOT = useMemo(() => {
    return isCasinoLive ? LIVE_DATA_SOURCE : DATA_SOURCE
  }, [isCasinoLive])

  const CASINO_GROUPS_URL_BASE = `${process.env.NEXT_PUBLIC_CASINO_API_URL}/groups/DATASOURCE?fields=id,name,games&expand=games`
  const CASINO_GROUPS_URL = CASINO_GROUPS_URL_BASE.replace(
    'DATASOURCE',
    DATA_LIVE_OR_SLOT,
  )
  const { data: groupGames } = useFetch(CASINO_GROUPS_URL)

  return (
    <CasinoContext.Provider
      value={{
        activeCasinoVendorFilter,
        setActiveCasinoVendorFilter,
        activeCasino,
        setActiveCasino,
        activeCasinoVendor,
        setActiveCasinoVendor,
        activeLiveCasino,
        setActiveLiveCasino,
        dataSource,
        setDataSource,
        isDropdownOpenMorePlayed,
        setIsDropdownOpenMorePlayed,
        treatedFavorites,
        setTreatedFavorites,
        isCasinoLive,
        setCasinoLive,
        gameTypeSidebar,
        setGameTypeSidebar,
        gameLocationIndex,
        setGameLocationIndex,
        banners,
        mutateFavorites,
        groupGames,
      }}
    >
      {children}
    </CasinoContext.Provider>
  )
}

export function useCasino() {
  const { push } = useRouter()
  const { isLogged } = useAuth()
  const { handleOpenModalLogin } = useModal()
  const { trendingGames } = useIntelligentLayouts()
  const context = useContext(CasinoContext)
  const { setDataLayer } = useGoogleTagManager()
  const {
    groupGames,
    setActiveCasinoVendor,
    setActiveCasino,
    activeCasino,
    treatedFavorites,
    setGameLocationIndex,
  } = context
  const { account } = useContext(AppContext)

  const changeCasinoCategoryDataLayer = (category: string) => {
    const EVENT_NAME = 'change-casino-category'
    const FULL_NAME = account.firstname + ' ' + account.surname
    setDataLayer({
      event: EVENT_NAME,
      casino_category: category,
      user: {
        id: account.userID,
        name: FULL_NAME,
        email: account.email,
        phone: account.phone,
      },
    })
  }

  const changeGameCurrentCategory = (category: string) => {
    setActiveCasinoVendor(NONE_VENDOR)
    setActiveCasino(category)
    changeCasinoCategoryDataLayer(category)
  }

  const optimizedGroupGames = useMemo(() => {
    const HAS_NOT_GROUP_GAME = !groupGames || groupGames.items.length === 0
    if (HAS_NOT_GROUP_GAME) return groupGames

    const optimizedItems = groupGames.items.map((groupGame) => {
      const games = {
        ...groupGame.games,
        items: getGamesToCurrentPlatform(
          groupGame.games.items,
          navigator?.userAgent,
        ),
      }

      if (groupGame.id === 'TESTELOBBY$em-alta' && trendingGames) {
        games.items = trendingGames
        games.total = games.items.length
        games.count = games.items.length
      }

      return {
        ...groupGame,
        games,
      }
    })

    return {
      ...groupGames,
      items: optimizedItems,
    }
  }, [groupGames, trendingGames])

  const categoriesWithAllGamesCategory = useMemo(() => {
    let resCategories = []
    if (optimizedGroupGames) {
      resCategories = [
        { id: ALL_GAMES_ID, name: ALL_GAMES_NAME, games: { count: 1 } },
      ].concat(
        optimizedGroupGames?.items?.filter((item) => item.games.count > 0),
      )
    }
    return resCategories
  }, [optimizedGroupGames]) as GameCategory[]

  const filteredGamesByCategory = useMemo(() => {
    if (
      optimizedGroupGames &&
      optimizedGroupGames?.items?.length > 0 &&
      activeCasino !== ALL_GAMES_NAME
    ) {
      return (
        optimizedGroupGames.items.find(
          (groupGame) => groupGame.name === activeCasino,
        )?.games?.items ?? ([] as Game[])
      )
    }
  }, [optimizedGroupGames, activeCasino])

  const isGameFavorite = useCallback(
    (gameName: string) => {
      const game = treatedFavorites?.items?.find(
        (favorite) => favorite?.gameModel?.name === gameName,
      )

      return game !== undefined
    },
    [treatedFavorites],
  )

  const openCasinoGame = (slug: string, index?: number) => {
    index && setGameLocationIndex(index) // Optimove request
    Cookies.set('game_slug', slug)
    if (isLogged) {
      push(`/cassino/game/${slug}`)
      return
    }
    handleOpenModalLogin()
  }

  if (!context) {
    throw new Error('useCasino must be used within an CasinoProvider')
  }

  return {
    ...context,
    changeGameCurrentCategory,
    optimizedGroupGames,
    categoriesWithAllGamesCategory,
    filteredGamesByCategory,
    isGameFavorite,
    openCasinoGame,
  }
}
