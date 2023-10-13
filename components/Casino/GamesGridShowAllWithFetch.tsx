import React, { useState } from 'react'

import { BasicCasinoResponse, Game } from 'types/casino'

import { useFetch } from 'hooks/useFetch'

import { useCasino } from 'hooks/useCasino'
import { GamesGridShowAll } from './GamesGridShowAll'

interface GamesGridShowAllWithFetchProps {
  isVendor?: boolean
  title?: string
  isCasinoLive?: boolean
}

const PER_PAGE = 50

export const GamesGridShowAllWithFetch: React.FC<
  GamesGridShowAllWithFetchProps
> = ({ title, isVendor = false, isCasinoLive }) => {
  const CASINO_ALL_GAMES = isCasinoLive
    ? `${process.env.NEXT_PUBLIC_CASINO_API_URL}/games?datasource=LIVECASINO&language=pt&orderBy=DES&selectedCountryCode=BR`
    : `${process.env.NEXT_PUBLIC_CASINO_API_URL}/games?language=pt&orderBy=DES&selectedCountryCode=BR`

  const { activeCasinoVendor } = useCasino()

  const [page, setPage] = useState(0)

  const WITH_VENDOR = isVendor
    ? `&filter=subVendor%3D${activeCasinoVendor}`
    : ''
  const OFFSET = page * PER_PAGE

  const { data: allGames } = useFetch<BasicCasinoResponse<Game>>(
    `${CASINO_ALL_GAMES}${WITH_VENDOR}&pagination=offset=${OFFSET},limit=${PER_PAGE}`,
  )

  function loadMoreGames() {
    setPage((prevPage) => prevPage + 1)
  }

  return (
    <GamesGridShowAll
      title={title ?? activeCasinoVendor}
      games={allGames?.items ?? []}
      loadMoreGames={loadMoreGames}
      hasInfiniteScroll
    />
  )
}

export default GamesGridShowAllWithFetch
