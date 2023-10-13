import DesktopSidebar from '../Sidebar/Desktop'
import { StarIcon } from '@heroicons/react/20/solid'
import { GameGridItem } from './GameGridItem'
import { Breadcrumber } from '../Breadcrumber'
import { useTranslation } from 'next-i18next'

export function FavoritesPage({ games }) {
  const { t } = useTranslation(['common'])

  const GAMES_AMOUNT = games?.items.filter((game) => game.gameModel).length

  const pages = [
    { name: 'Cassino', href: '/cassino', current: false },
    { name: t('Favorites'), href: '#', current: true },
  ]

  return (
    <div className="relative p-4 lg:px-14 lg:py-5">
      <DesktopSidebar />
      <div className="lg:ml-64">
        <div className="relative w-full h-full min-h-screen mx-auto space-y-5 max-w-screen-8xl lg:space-y-8">
          <Breadcrumber pages={pages} />
          <div className="flex items-start space-x-3">
            <StarIcon className="w-6 h-6 mb-1 text-favorite lg:h-10 lg:w-10" />
            <div className="flex flex-col space-y-px">
              <h2 className="text-sm font-bold text-white lg:text-xl">
                {t('Favorite Games')}
              </h2>
              <span className="text-xs text-textPrimary lg:text-sm">
                {GAMES_AMOUNT} {t('games')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 col-span-4 gap-5 lg:grid-cols-6 lg:gap-7">
            {GAMES_AMOUNT === 0 ? (
              <span className="col-span-6 text-xl text-textPrimary">
                {t(
                  'No favorite games to show. Start playing now and add your favorite games to the list!',
                )}
              </span>
            ) : (
              games?.items
                .filter((game) => game.gameModel)
                .map((game) => {
                  return <GameGridItem key={game.id} game={game.gameModel} />
                })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
