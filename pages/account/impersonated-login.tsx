import EllipsisLoading from '@/components/EllipsisLoading'
import { AppContext } from 'contexts/context'
import Cookies from 'js-cookie'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import PlayerApi from 'services/PlayerApi'
import { useAuth } from '../../hooks/useAuth'
import { useSession } from '../../hooks/useSession/useSession'
import { doToast } from '../../utils/toastOptions'
import { Button } from 'design-system/button'

export default function ImpersonatedLogin() {
  const router = useRouter()
  const auth = useAuth()
  const {
    setUserId,
    setSessionId,
    setIsEmailVerified,
    setRoles,
    setLogged,
    session,
  } = useSession()
  const { setLoadingAuth, loadingAuth } = useContext(AppContext)
  const { token } = router.query
  const THE_TOKEN = token || router.query._sid

  const impersonate = async () => {
    if (!THE_TOKEN) {
      doToast('Token não encontrado')
      return
    }

    try {
      setLoadingAuth(true)
      await auth.handleLogout(false)

      await session.call('/user#impersonatedLogin', { token: THE_TOKEN })

      const sessionInfo = await session.call('/user#getSessionInfo')

      if (sessionInfo?.isAuthenticated) {
        setLogged(true)
        setIsEmailVerified(true)
        setUserId(sessionInfo?.userID)
        setRoles(sessionInfo?.roles)

        const { cmsSessionID } = await session.call('/user#getCmsSessionID')
        setSessionId(cmsSessionID)
        PlayerApi.defaults.headers.common['X-SessionId'] = cmsSessionID

        const { cid } = await session.call('/connection#getClientIdentity')
        Cookies.set('cid', cid, { httpOnly: true, secure: true, path: '/' })
      }

      setLoadingAuth(false)
    } catch (e) {
      router.push('/cassino')
    }
  }

  useEffect(() => {
    impersonate()
  }, [])

  return (
    <div className="flex items-center h-full px-6 mx-auto py-52">
      <div className="flex flex-col items-center max-w-sm mx-auto text-center">
        <div className="mt-6">
          {loadingAuth ? (
            <EllipsisLoading />
          ) : (
            <Link href="/cassino">
              <Button>Ir para o início</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
