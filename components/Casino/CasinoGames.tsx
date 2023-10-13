import dynamic from 'next/dynamic'
import { memo } from 'react'
import Vendors from './Vendors/Vendors'
import VendorsGridShowAll from './Vendors/VendorsGridShowAll'
import { useTranslation } from 'next-i18next'
import {
  ALL_GAMES_NAME,
  ALL_VENDORS,
  NONE_VENDOR,
  useCasino,
} from '@/hooks/useCasino'
import { GamesGrid } from './GamesGrid'
import { GamesGridShowAll } from './GamesGridShowAll'

const configSuspense = {
  suspense: true,
  ssr: false,
}

const GamesGridShowAllWithFetch = dynamic(
  () => import('./GamesGridShowAllWithFetch'),
  { ...configSuspense },
)

type CasinoGamesProps = {
  isSearching: boolean
}

function Casino({ isSearching }: CasinoGamesProps) {
  const { t } = useTranslation(['common'])
  const {
    activeCasinoVendor,
    activeCasino,
    filteredGamesByCategory,
    isCasinoLive,
    optimizedGroupGames,
  } = useCasino()

  if (activeCasinoVendor !== NONE_VENDOR) {
    return <GamesGridShowAllWithFetch isVendor isCasinoLive={isCasinoLive} />
  }

  if (!isSearching) {
    if (activeCasino !== ALL_GAMES_NAME && activeCasino !== ALL_VENDORS) {
      return (
        <GamesGridShowAll
          title={`${activeCasino}`}
          games={filteredGamesByCategory}
        />
      )
    }

    if (activeCasino === ALL_VENDORS) return <VendorsGridShowAll />

    if (activeCasino === ALL_GAMES_NAME) {
      return (
        <div className="relative space-y-10">
          {optimizedGroupGames?.items?.map((groupGame, i) => (
            <div key={i} className="relative space-y-10">
              <GamesGrid
                key={i}
                category={groupGame.name}
                games={groupGame.games.items}
                highligth={
                  groupGame.name === 'Em Alta' ||
                  groupGame.id === 'LIVECASINO$populares'
                }
              />
              {!isCasinoLive && groupGame.name === 'Em Alta' && <Vendors />}
            </div>
          ))}

          <GamesGridShowAllWithFetch
            title={t('All')}
            isCasinoLive={isCasinoLive}
          />
          <div className="lg:mb-16"></div>
        </div>
      )
    }
  }
}

export const CasinoGames = memo(Casino)
