import { useContext } from 'react'
import { useTranslation } from 'next-i18next'
import { AppContext } from 'contexts/context'
import { MenuItem } from '../../components/Sidebar/Core/types'
import { useAuth } from '../useAuth'
import { useIntelligentLayouts } from '../useOptix/useIntelligentLayouts'

export default function useSidebar() {
  const { setOpenSideBar } = useContext(AppContext)
  const { isLogged } = useAuth()
  const { t } = useTranslation(['common'])
  const { recentlyPlayedGames } = useIntelligentLayouts()

  function closeMenu() {
    setOpenSideBar(false)
  }

  const MenuItems: MenuItem[] = [
    {
      defaultOpen: true,
      sub: [
        {
          name: t('Recent'),
          icon: 'liveSports',
          hide: !isLogged || !recentlyPlayedGames,
          recentlyGames: true,
        },
        {
          name: t('Most Played'),
          icon: 'fire',
          populars: true,
        },
        {
          name: t('Types of games'),
          icon: 'providers',
          kindOfGames: true,
        },
      ],
    },

    {
      defaultOpen: true,
      sub: [
        {
          name: t('Popular'),
          icon: 'fire',
          popularMatches: true,
        },
        {
          name: t('All sports'),
          icon: 'ball',
          allSports: true,
        },
      ],
    },

    {
      defaultOpen: true,
      sub: [
        {
          name: t('Promotions'),
          icon: 'bonus100',
          promotions: true,
        },
      ],
    },
  ]

  return { MenuItems, closeMenu }
}
