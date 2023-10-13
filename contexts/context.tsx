import { createContext, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import ExtractProfile from '@/components/Account/Extract'
import Profile from '@/components/Account/Profile'
import { useSession } from '@/hooks/useSession'
import { BalanceProvider } from 'hooks/useBalance'
import { CasinoProvider } from 'hooks/useCasino'
import { userCpfData } from '../services/CpfCnpjApi'
import { createSportsBookUrl } from './helpers'
import { ContextProps, Query } from './types'
import { useModal } from '@/hooks/useModal'
import { IntelligentLayoutsProvider } from '@/hooks/useOptix/useIntelligentLayouts'
import { useTranslation } from 'next-i18next'

export const AppContext = createContext<ContextProps>(undefined)

export function AppContextProvider({ children }) {
  const { t } = useTranslation(['common'])
  const router = useRouter()
  const [wallet, setWallet] = useState(0)
  const { logged, isEmailVerified, setIsEmailVerified, account } = useSession()
  const [activeAccount, setActiveAccount] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isOnTermsOfService, setIsOnTermsOfService] = useState(false)
  const [loadingAuth, setLoadingAuth] = useState(false)
  const [openSideBar, setOpenSideBar] = useState(false)
  const [userCpfData, setUserCpfData] = useState<userCpfData | null>(null)
  const [activeCategorySport, setActiveCategorySport] = useState(0)
  const [profileOption, setProfileOption] = useState(1)
  const [betSlipBettingSelectionsCount, setBetSlipBettingSelectionsCount] =
    useState(0)
  const [iframeRef, setIframeRef] = useState(null)
  const [betSlipOverlay, setBetSlipOverlay] = useState(false)
  const [sidebarSearchQuery, setSidebarSearchQuery] = useState<string | null>(
    null,
  )
  const [accountPanels, setAccountPanels] = useState([
    {
      title: t('Profile'),
      component: <Profile />,
      defaultOpen: true,
    },
    {
      title: t('Statement'),
      component: <ExtractProfile />,
      defaultOpen: true,
    },
  ])
  const [dynamicUrl, setDynamicUrl] = useState('/')
  const [isInitialLoginLoading, setIsInitialLoginLoading] = useState(true)
  const [currentSidebar, setCurrentSidebar] = useState('Sport')

  const { handleQueryModal } = useModal()

  const query = router.query as Query

  const handleRouteChange = useCallback(() => {
    if (
      !router.pathname.includes('email-confirm') &&
      !isEmailVerified &&
      logged
    ) {
      router.push({
        pathname: '/account/email-confirm',
        query: {
          event: 'success-registered',
        },
      })
    }
  }, [isEmailVerified, logged, router])

  function setIframeLink(url: string) {
    const BASE = '/esportes/'
    router.push(BASE + url)
    setDynamicUrl(url)
  }

  const createUrl = (item) => setIframeLink(createSportsBookUrl(item))

  const username = account?.username
  const isGmailSignup = username?.includes('@gmail.com')

  useEffect(() => {
    // email confirm
    handleRouteChange()

    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [handleRouteChange, router.events])

  useEffect(() => {
    handleQueryModal(query, logged)
  }, [query, logged])

  return (
    <AppContext.Provider
      value={{
        loading,
        setLoading,
        openSideBar,
        setOpenSideBar,
        account,
        userCpfData,
        setUserCpfData,
        activeCategorySport,
        setActiveCategorySport,
        profileOption,
        setProfileOption,
        betSlipBettingSelectionsCount,
        setBetSlipBettingSelectionsCount,
        setIframeRef,
        iframeRef,
        betSlipOverlay,
        setBetSlipOverlay,
        setSidebarSearchQuery,
        sidebarSearchQuery,
        loadingAuth,
        setLoadingAuth,
        accountPanels,
        setAccountPanels,
        isEmailVerified,
        setIsEmailVerified,
        activeAccount,
        setActiveAccount,
        wallet,
        setWallet,
        dynamicUrl,
        setDynamicUrl,
        setIsInitialLoginLoading,
        isInitialLoginLoading,
        isOnTermsOfService,
        setIsOnTermsOfService,
        setIframeLink,
        createUrl,
        currentSidebar,
        setCurrentSidebar,
        isGmailSignup,
      }}
    >
      <BalanceProvider>
        <CasinoProvider>
          <IntelligentLayoutsProvider>{children}</IntelligentLayoutsProvider>
        </CasinoProvider>
      </BalanceProvider>
    </AppContext.Provider>
  )
}
