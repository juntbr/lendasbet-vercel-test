import axios from 'axios'
import { useEffectOnce } from 'hooks/useEffectOnce'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { SESSION_STORAGE, CID_STORAGE } from 'constants/index'
import { ProfileRequest, ProfileResponse } from 'interfaces/profile.interface'
import Cookies from 'js-cookie'
import PlayerApi from 'services/PlayerApi'
import { SessionStateCode } from './services/types'
import WebApiService, { WebApiConfig } from './services/webapi.service'
import { useModal } from '../useModal'
import { useFetch } from '../useFetch'
import { Balance } from 'types/gamMatrix'

const session = new WebApiService()

interface SessionContextValue {
  session: WebApiService
  isConnected: boolean
  captchaResponse: null | string
  setCaptchaResponse: (response: string) => void
  sessionStateCode: SessionStateCode | null
  notShowMessage: boolean
  setNotShowMessage: (value: boolean) => void
  logged: boolean
  roles: string[] | null
  account: any
  setAccount: (account: ProfileResponse) => void
  setLogged: (value: boolean) => void
  userId: string | null
  setUserId: (value: string) => void
  setRoles: (value: string[]) => void
  isEmailVerified: boolean
  setIsEmailVerified: (value: boolean) => void
  setSessionId: (value: string) => void
  sessionId: string | null
  isInitialLoginLoading: boolean
  fetchWallet: any
}

const SessionContext = createContext<SessionContextValue>(null)

interface SessionProviderParams {
  children: React.ReactNode
  config: WebApiConfig
  fallback?: React.ReactNode
}

export const SessionProvider: React.FC<SessionProviderParams> = ({
  children,
  config,
  fallback,
}) => {
  const [loading, setLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [captchaResponse, setCaptchaResponse] = useState<string | null>(null)
  const [sessionStateCode, setSessionStateCode] =
    useState<SessionStateCode | null>(null)
  const [notShowMessage, setNotShowMessage] = useState(false)
  const [account, setAccount] = useState({})
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)

  const [roles, setRoles] = useState<string[] | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  const [isInitialLoginLoading, setIsInitialLoginLoading] = useState(true)

  const [logged, setLogged] = useState(false)

  const { handleOpenModalConsent } = useModal()

  if (!config?.url || !config?.realm) {
    throw new Error('SessionProvider: url or realm not defined')
  }

  useEffectOnce(() => {
    session.setConfig(config)

    session
      .initialize({
        withRegistration: true,
        onOpen: (session) => {
          setIsConnected(true)
          session.call('/user#getSessionInfo')
          session
            .call('/connection#getClientIdentity')
            .then((response) => {
              Cookies.set(CID_STORAGE, response?.kwargs?.cid, {
                httpOnly: true,
                secure: true,
                path: '/',
              })
            })
            .catch((error) => {
              //
            })
        },
        onClose: () => setIsConnected(false),
        onSessionStateChange: (code) => setSessionStateCode(code),
      })
      .catch(() => {
        //
      })
      .finally(() => setLoading(false))
  })

  useEffect(() => {
    const getProfile = async () => {
      const response = await session.call<ProfileResponse>(
        '/user/account#getProfile',
        {} as ProfileRequest,
      )

      setAccount(response.fields)
    }

    if (logged) {
      getProfile()
    }
  }, [logged, session])

  const fetchAuthenticatedUser = useCallback(async () => {
    try {
      const sessionID =
        localStorage.getItem(SESSION_STORAGE) ?? Cookies.get(SESSION_STORAGE)

      if (sessionID) {
        const autoLogin = await session.call('/user#loginWithCmsSessionID', {
          sessionID,
        })

        // outras informacoes da sessao
        session
          .call('/user#getSessionInfo')
          .then((sessionInfo) => {
            setUserId(sessionInfo?.userID)
            setRoles(sessionInfo?.roles)
          })
          .catch((error) => {
            // TODO tratar erro ao obter informacoes de sessao
          })

        session.call('/user/account#watchBalance').catch((error) => {})

        // adicionar header em playerAPI
        PlayerApi.defaults.headers.common['X-SessionId'] = sessionID

        const response = await session.call<ProfileResponse>(
          '/user/account#getProfile',
          {} as ProfileRequest,
        )

        setAccount(response.fields)
        setIsEmailVerified(autoLogin.isEmailVerified)
        // TODO abrir modal
        autoLogin?.hasToAcceptTC && handleOpenModalConsent()
        setSessionId(sessionID)
        setLogged(true)
        setIsInitialLoginLoading(false)

        return () => {
          session.unsubscribe('/account/balanceChanged')
        }
      }

      setIsInitialLoginLoading(false)
    } catch (error) {
      // remove itens que já expiraram;
      localStorage.removeItem(SESSION_STORAGE)
      Cookies.remove(SESSION_STORAGE)

      setIsInitialLoginLoading(false)
      setLogged(false)
      setSessionId(null)
    }
  }, [session])

  useEffect(() => {
    if (isConnected) {
      fetchAuthenticatedUser()
    }
  }, [fetchAuthenticatedUser, isConnected])

  const fallbackWhenLoading = fallback ?? <h1>loading...</h1>

  return (
    <SessionContext.Provider
      value={{
        session,
        isConnected,
        captchaResponse,
        setCaptchaResponse,
        sessionStateCode,
        notShowMessage,
        setNotShowMessage,
        logged,
        roles,
        account,
        setAccount,
        setLogged,
        userId,
        setRoles,
        setUserId,
        isEmailVerified,
        setIsEmailVerified,
        setSessionId,
        sessionId,
        isInitialLoginLoading,
      }}
    >
      {loading ? fallbackWhenLoading : children}
    </SessionContext.Provider>
  )
}

export function useSession(): SessionContextValue {
  const context = useContext(SessionContext)

  const FetchWallet = (sessionIdParam?: string) => {
    const sessionID = sessionIdParam || context.sessionId
    return useFetch<{
      items: Balance[]
    }>(
      context.logged && sessionID
        ? `${process.env.NEXT_PUBLIC_PLAYER_API_URL}/${context.userId}/wallet`
        : null,
      {
        params: {
          headers: {
            'X-SessionId': sessionID,
          },
        },
      },
    )
  }

  const fetchWalletOnLogin = async (sessionIdParam: string, userId: string) => {
    const url = sessionIdParam
      ? `${process.env.NEXT_PUBLIC_PLAYER_API_URL}/${userId}/wallet`
      : null

    if (!url) return undefined

    return await axios.get(url, {
      headers: {
        'X-SessionId': sessionIdParam,
      },
    })
  }

  useEffect(() => {
    const { captchaResponse, session } = context
    // sobrescreve call para que toda chamada tenha captcha,
    session.call = async (url: string, params?: any) => {
      if (captchaResponse?.length > 0) {
        const newParams = {
          ...params,
          captchaPublicKey: process.env.NEXT_PUBLIC_RECAPTCHA_KEY,
          captchaResponse,
        }

        return session.rawCall(url, newParams)
      }

      return session.rawCall(url, params)
    }
  }, [context])

  if (!context) {
    throw new Error('useSession must be used within an SessionProvider')
  }

  return { ...context, fetchWallet: FetchWallet, fetchWalletOnLogin }
}
