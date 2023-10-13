import DesktopSidebar from '../Sidebar/Desktop'
import { GameGridItem } from './GameGridItem'
import Image from 'next/image'
import LoadingSkeletonCasino from '../Loadings/LoadingSkeletonCasino'
import { Breadcrumber } from '../Breadcrumber'
import { useTranslation } from 'next-i18next'

export function RecentlylPlayedPage({ games }) {
  const { t } = useTranslation(['common'])

  const pages = [
    { name: 'Cassino', href: '/cassino', current: false },
    { name: t('Recently Played'), href: '#', current: true },
  ]

  return (
    <div className="relative p-4 lg:px-14 lg:py-5">
      <DesktopSidebar />
      <div className="lg:ml-64">
        <div className="relative w-full h-full min-h-screen mx-auto space-y-5 max-w-screen-8xl lg:space-y-8">
          <Breadcrumber pages={pages} />

          <div className="flex items-center space-x-3">
            <Image
              src="/images/cartas.svg"
              alt="Cartas"
              width={40}
              height={40}
              className="w-6 h-6 lg:h-10 lg:w-10"
            />
            <div className="flex flex-col space-y-px">
              <h2 className="text-sm font-bold text-white lg:text-xl">
                {t('Recently Played Games')}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 col-span-4 gap-5 lg:grid-cols-6 lg:gap-7">
            {!games ? (
              <LoadingSkeletonCasino />
            ) : (
              games?.map((game) => {
                return <GameGridItem key={game.id} game={game} />
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
