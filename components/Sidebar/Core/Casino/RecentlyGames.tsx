import LoadingSkeletonSidebar from '@/components/Loadings/LoadingSkeletonSidebar'
import { useCasino } from '@/hooks/useCasino'
import { useIntelligentLayouts } from '@/hooks/useOptix/useIntelligentLayouts'

export default function RecentlyGames() {
  const { openCasinoGame } = useCasino()
  const { recentlyPlayedGames } = useIntelligentLayouts()

  if (recentlyPlayedGames?.length === 0) return <LoadingSkeletonSidebar />

  return (
    <ul className="flex flex-col items-start justify-center px-1 space-y-4">
      {recentlyPlayedGames &&
        recentlyPlayedGames?.map((game) => {
          return (
            <li key={game?.id} title={game?.gameModel?.name}>
              <button
                onClick={() => openCasinoGame(game.slug)}
                className="flex items-center justify-center w-full space-x-4 font-medium group"
              >
                <span className="text-sm font-bold whitespace-nowrap text-neutral-20 group-hover:text-white">
                  {game?.name}
                </span>
              </button>
            </li>
          )
        })}
    </ul>
  )
}
