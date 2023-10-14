import axios from 'axios'
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import useWindowSize from '../UseWindowSize'
import { useAuth } from '../useAuth'

type GameItem = {
  id: string
  slug: string
  name: string
  defaultThumbnail: string
}

export type IntelligentLayoutsContextType = {
  trendingGames: GameItem[]
  recentlyPlayedGames: GameItem[]
}

const defaultContext: IntelligentLayoutsContextType = {
  trendingGames: [],
  recentlyPlayedGames: [],
}

const IntelligentLayoutsContext = createContext(defaultContext)

export const IntelligentLayoutsProvider = ({ children }: PropsWithChildren) => {
  const [trendingGames, setTrendingGames] = useState()
  const [recentlyPlayedGames, setRecentlyPlayedGames] = useState()
  const { isMobile } = useWindowSize()
  const { userId } = useAuth()

  const channel = isMobile ? 'mobile' : 'desktop'

  const fetchIntelligentLayout = useCallback(async () => {
    const res = await axios.get(
      `/api/casino/optix/intelligentLayouts?userId=${userId}&channel=${channel}`,
    )

    setRecentlyPlayedGames(res.data.data?.recentlyPlayedGames)
    setTrendingGames(res.data.data.trendingGames)
  }, [channel, userId])

  useEffect(() => {
    fetchIntelligentLayout()
  }, [fetchIntelligentLayout, userId])

  return (
    <IntelligentLayoutsContext.Provider
      value={{
        trendingGames,
        recentlyPlayedGames,
      }}
    >
      {children}
    </IntelligentLayoutsContext.Provider>
  )
}

export function useIntelligentLayouts() {
  const context = useContext(IntelligentLayoutsContext)

  return context
}
