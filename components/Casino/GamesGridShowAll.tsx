import {
  ALL_GAMES_NAME,
  ALL_VENDORS,
  NONE_VENDOR,
  useCasino,
} from '@/hooks/useCasino'
import { ReactNode, memo, useEffect, useState } from 'react'

import InfiniteScroll from 'react-infinite-scroll-component'
import { Game } from 'types/casino'
import { doToast } from 'utils/toastOptions'

import RenderIf from '@/utils/ConditionalHelpers'
import { ArrowLeftIcon } from '@heroicons/react/20/solid'
import { Button } from 'design-system/button'
import { useTranslation } from 'next-i18next'
import LoadingSpinnerCasino from '../Loadings/LoadingSpinnerCasino'
import { GameGridItem } from './GameGridItem'

interface GamesGridShowAllProps {
  games: Game[]
  title: string
  footer?: ReactNode
  hasInfiniteScroll?: boolean
  loadMoreGames?(): void
}

function GamesGrid({
  games,
  title,
  footer,
  hasInfiniteScroll,
  loadMoreGames,
}: GamesGridShowAllProps) {
  const { t } = useTranslation(['common'])

  const [totalGames, setTotalGames] = useState(games)

  useEffect(() => {
    if (games) {
      setTotalGames((prevState) => {
        return [...prevState, ...games]
      })
    }
  }, [games])

  const {
    setActiveCasinoVendorFilter,
    changeGameCurrentCategory,
    setActiveCasinoVendor,
    activeCasinoVendor,
    setActiveCasino,
    activeCasino,
  } = useCasino()

  if (
    games?.length === 0 &&
    (activeCasino !== 'Ver tudo' || activeCasinoVendor !== 'NONE')
  ) {
    setActiveCasinoVendorFilter(0)
    setActiveCasinoVendor('NONE')
    setActiveCasino('Ver tudo')

    doToast('Categoria selecionada não possui jogos disponíveis!')
  }

  const TITLE_GAMB = title === 'LadyLuckGames' ? 'Slot Matrix' : title

  const ALL_GAMES_GRID = TITLE_GAMB === t('All')

  function goBack() {
    activeCasinoVendor !== NONE_VENDOR
      ? changeGameCurrentCategory(ALL_VENDORS)
      : changeGameCurrentCategory(ALL_GAMES_NAME)
  }

  useEffect(() => {
    if (totalGames.length > 0) {
      setTotalGames(games)
    }
  }, [activeCasino, activeCasinoVendor])

  return (
    <div className="flex h-full flex-col space-y-4">
      <div
        data-allGamesGrid={ALL_GAMES_GRID}
        className="flex w-full items-center justify-between space-x-0 text-white data-[allGamesGrid=false]:flex-row-reverse"
      >
        {!ALL_GAMES_GRID && (
          <Button
            size="small"
            variant="outline"
            onClick={goBack}
            startIcon={<ArrowLeftIcon className="mb-1 h-4 w-4 text-primary" />}
          >
            Voltar
          </Button>
        )}

        <h2 className="text-start font-bold text-white lg:text-lg">
          {TITLE_GAMB}
        </h2>
      </div>
      <RenderIf condition={hasInfiniteScroll}>
        <InfiniteScroll
          dataLength={totalGames?.length || 0}
          next={loadMoreGames}
          hasMore={true}
          loader={<LoadingSpinnerCasino />}
        >
          <div className="col-span-4 grid grid-cols-2 gap-5 lg:grid-cols-6">
            {totalGames?.map?.((game, i) => (
              <GameGridItem
                highligth={title === 'Em Alta' || title === 'Populares'}
                key={game.id}
                index={i}
                game={game}
              />
            ))}
          </div>
        </InfiniteScroll>
      </RenderIf>
      <RenderIf condition={!hasInfiniteScroll}>
        <div className="col-span-4 grid grid-cols-2 gap-5 lg:grid-cols-6">
          {totalGames?.map?.((game, i) => (
            <GameGridItem
              highligth={title === 'Em Alta' || title === 'Populares'}
              key={game.id}
              index={i}
              game={game}
            />
          ))}
        </div>
      </RenderIf>
      {footer && footer}
    </div>
  )
}

export const GamesGridShowAll = memo(GamesGrid)
