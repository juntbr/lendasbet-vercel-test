import Search from '@/components/Search'
import { useAuth } from '@/hooks/useAuth'
import useClientTranslations from '@/hooks/useClientTranslation'
import { useModal } from '@/hooks/useModal'
import { CurrencyDollarIcon, StarIcon } from '@heroicons/react/20/solid'
import { AppContext } from 'contexts/context'
import { Button } from 'design-system/button'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import useSidebar from '../../../hooks/useSidebar'
import Topic from './Topic'
import { MenuItem } from './types'

export default function Core() {
  const {
    currentSidebar,
    setCurrentSidebar,
    sidebarSearchQuery,
    setOpenSideBar,
    openSideBar,
  } = useContext(AppContext)

  const { MenuItems } = useSidebar()
  const { isLogged } = useAuth()
  const { push } = useRouter()

  const { t } = useClientTranslations(['sidebar', 'common'])

  const { handleOpenModalRAF } = useModal()

  function searchSubmit(query) {
    setOpenSideBar(false)
    if (currentSidebar === 'Sport') {
      push('/esportes?op=openSearchModal&query=' + query)
    } else {
      push('/cassino')
    }
  }

  const SPORT_SIDEBAR = currentSidebar === 'Sport'

  const sidebar = SPORT_SIDEBAR
    ? [MenuItems[1], MenuItems[2]]
    : [MenuItems[0], MenuItems[2]]

  return (
    <div className="space-y-5 px-4 py-5">
      <div className="flex items-center justify-between space-x-3">
        <Button
          onClick={() => setCurrentSidebar('Sport')}
          className="w-full"
          variant={SPORT_SIDEBAR ? 'primary' : 'outline'}
          startIcon={
            <Image
              src="/images/soccer.svg"
              alt="bola de futebol"
              width={16}
              height={16}
              className="h-5 w-5"
            />
          }
        >
          {t('Sports')}
        </Button>

        <Button
          onClick={() => setCurrentSidebar('Casino')}
          className="w-full"
          variant={!SPORT_SIDEBAR ? 'primary' : 'outline'}
          startIcon={
            <Image
              src="/images/cartas.svg"
              alt="Cartas"
              width={16}
              height={16}
              className="h-5 w-5"
            />
          }
        >
          {t('Casino')}
        </Button>
      </div>
      <Search submit={searchSubmit} input={sidebarSearchQuery} />
      <Button
        data-hidden={!isLogged}
        className="w-full uppercase data-[hidden=true]:hidden"
        onClick={handleOpenModalRAF}
        size="large"
        endIcon={<CurrencyDollarIcon className="mb-1 h-6 w-6 text-favorite" />}
        variant="outline"
      >
        {t('Refer and earn')}
      </Button>

      <Button
        onClick={() => {
          setOpenSideBar(!openSideBar)

          push('/cassino/favoritos')
        }}
        data-hidden={!isLogged || SPORT_SIDEBAR}
        variant="outline"
        size="large"
        endIcon={<StarIcon className="mb-1 h-6 w-6 text-favorite" />}
        className="w-full uppercase data-[hidden=true]:hidden"
      >
        Favoritos
      </Button>

      {sidebar.map((item: MenuItem, i) => (
        <div key={i} className="space-y-10">
          <Topic item={item} />
        </div>
      ))}
    </div>
  )
}
