import Cookies from 'js-cookie'
import { useCallback, useContext, useEffect } from 'react'
import { useTranslation } from 'next-i18next'

import { SESSION_STORAGE } from '../../constants'
import {
  SESSION_STATES_CODE_MESSAGES,
  SessionStateCode,
} from '../useSession/services/types'

import { AppContext } from 'contexts/context'
import { useSession } from 'hooks/useSession'
import { useRouter } from 'next/router'
import PlayerApi from 'services/PlayerApi'
import { doToast } from 'utils/toastOptions'
import { useLogin } from './useLogin'
import { useLogout } from './useLogout'
import { useModal } from '../useModal'

export function useAuth() {
  const context = useContext(AppContext)
  const {
    session,
    sessionStateCode,
    notShowMessage,
    logged,
    setLogged,
    userId,
    setSessionId,
    isEmailVerified,
    setIsEmailVerified,
    sessionId,
  } = useSession()

  const { t } = useTranslation(['common'])

  const { close } = useModal()

  if (!context) {
    throw new Error('useAuth must be used within an AppProvider')
  }

  const { handleLogin } = useLogin()
  const { handleLogout } = useLogout()
  const router = useRouter()

  const clearOnLogout = useCallback(() => {
    setLogged(false)
    setSessionId(null)

    localStorage.removeItem(SESSION_STORAGE)

    PlayerApi.defaults.headers.common['X-SessionId'] = ''

    Cookies.remove('cid')

    Cookies.remove(SESSION_STORAGE)

    close()
  }, [setLogged, setSessionId])

  useEffect(() => {
    // Se não estiver logado ou nao for o valor inicial, faz tratativas de logout.
    if (sessionStateCode > SessionStateCode.LOGGED && logged) {
      if (notShowMessage === false) {
        doToast(t(SESSION_STATES_CODE_MESSAGES[sessionStateCode]))
      }
      clearOnLogout()

      session.reinitialize()
      router.push('/cassino')
    }
  }, [sessionStateCode, notShowMessage, clearOnLogout, logged, session])

  return {
    isLogged: logged,
    setIsLogged: setLogged,
    userId,
    sessionId,
    isEmailVerified,
    setIsEmailVerified,
    handleLogin,
    handleLogout,
  }
}
