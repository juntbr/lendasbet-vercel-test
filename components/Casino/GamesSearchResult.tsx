import { useContext, useEffect, useState } from 'react'
import useSWR from 'swr'
import fetcher from 'services/fetcher'
import { AppContext } from '../../contexts/context'
import { GameGridItem } from './GameGridItem'
import LoadingSkeletonCasino from '../Loadings/LoadingSkeletonCasino'

const CASINO_GROUPS_URL_BASE = `${process.env.NEXT_PUBLIC_CASINO_API_URL}/games?language=pt&orderBy=DES&selectedCountryCode=BR`

const GamesSearchResult: React.FC = () => {
  const { sidebarSearchQuery } = useContext(AppContext)

  const [games, setGames] = useState([])

  const searchFilter = sidebarSearchQuery
    ? `&filter=name=${encodeURIComponent(sidebarSearchQuery)}`
    : ''

  const baseURL = `${CASINO_GROUPS_URL_BASE}${searchFilter}`

  const { data, isLoading } = useSWR(baseURL, (url) => fetcher(url))

  useEffect(() => {
    if (data && data.items) {
      setGames(data.items)
    }
  }, [data])

  return (
    <div className="flex flex-col h-full space-y-3">
      <h2 className="font-bold text-white text-start">
        Resultado ({games?.length})
      </h2>
      <div className="grid grid-cols-2 col-span-4 gap-5 lg:grid-cols-6">
        {isLoading ? (
          <LoadingSkeletonCasino />
        ) : (
          games.map((game) => <GameGridItem key={game.id} game={game} />)
        )}
      </div>
    </div>
  )
}

export default GamesSearchResult
