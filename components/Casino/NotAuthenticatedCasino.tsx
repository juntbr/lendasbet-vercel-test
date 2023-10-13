import useEventTracker from '@/hooks/useEventTracker'
import { useGameRedirect } from '@/hooks/useGameRedirect'
import { useCasino } from 'hooks/useCasino'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { memo, useContext, useEffect } from 'react'
import { AppContext } from '../../contexts/context'
import TabsToggleTypeGames from '../Header/TabsToggleTypeGames'
import Search from '../Search'
import DesktopSidebar from '../Sidebar/Desktop'
import { CasinoBanner } from './Banner'
import { CasinoGames } from './CasinoGames'
import { FilterByGame } from './FilterByGame'

const configSuspense = {
  suspense: true,
  ssr: false,
}

const GamesSearchResult = dynamic(() => import('./GamesSearchResult'), {
  ...configSuspense,
})

function Casino({ isLive }) {
  const { sidebarSearchQuery, setCurrentSidebar } = useContext(AppContext)
  const { pathname } = useRouter()

  const ROUTE_PATH = pathname.slice(1, pathname.length)

  const { setCasinoLive } = useCasino()

  const { appendParamByEventWthRedirect } = useEventTracker()

  useGameRedirect()

  const isSearching = sidebarSearchQuery?.length > 0

  useEffect(() => {
    appendParamByEventWthRedirect(ROUTE_PATH)
    setCasinoLive(isLive)
    setCurrentSidebar('Casino')
  }, [])

  return (
    <div className="relative p-4 lg:px-14 lg:py-5">
      <DesktopSidebar />
      <div className="lg:ml-64">
        <TabsToggleTypeGames
          link="/cassino"
          liveLink="/cassino/ao-vivo"
          name="Cassino"
        />

        <div className="relative mx-auto h-full min-h-screen w-full max-w-screen-8xl space-y-5">
          <div className="mx-auto h-40 w-full rounded-lb lg:h-[250px]">
            <CasinoBanner />
          </div>
          <Search input={sidebarSearchQuery} className="lg:hidden" />
          <FilterByGame />
          {isSearching && <GamesSearchResult />}
          <CasinoGames isSearching={isSearching} />
        </div>
      </div>
    </div>
  )
}

export const NotAuthenticatedCasino = memo(Casino)
