import * as Sentry from '@sentry/browser'
import Cookies from 'js-cookie'
import { useContext } from 'react'

import { AppContext } from 'contexts/context'
import PlayerApi from 'services/PlayerApi'
import { doToast } from 'utils/toastOptions'
import { useSession } from '../useSession'
import { handleMessages } from '../useSession/helper/handleMessages'

import { useRouter } from 'next/router'
import { SESSION_STORAGE } from '../../constants'
import { useModal } from '../useModal'
import usePushNotification from '../usePushNotification'
import { callback, LoginParams, SessionInfoResponse } from './types'
import { useOptix } from '../useOptix'
import { v4 as uuid } from 'uuid'
import useWindowSize from '../UseWindowSize'
import { useBtag } from '../useBtag'

const ERROR_ALREADY_LOGGED = 'You are already logged in.'

export function useLogin() {
  const {
    session,
    setCaptchaResponse,
    setNotShowMessage,
    setRoles,
    setUserId,
    setSessionId,
    setLogged,
    setIsEmailVerified,
    fetchWalletOnLogin,
  } = useSession()
  const context = useContext(AppContext)
  const { close, handleOpenModalConsent } = useModal()
  const { linkDevice } = usePushNotification()
  const { identifier, tracker } = useOptix()
  const { push } = useRouter()
  const { isMobile } = useWindowSize()
  const { getBtagFromCookie } = useBtag()

  const firstLogin = (sessionInfo) => {
    if (!String(sessionInfo?.lastLoginTime)) return true
    return sessionInfo?.loginTime === sessionInfo?.lastLoginTime
  }

  async function onLoginSuccess(
    data: LoginParams,
    onSuccess?: callback,
    onError?: callback,
  ) {
    try {
      const btag = getBtagFromCookie()

      const sessionInfo = await session.call<SessionInfoResponse>(
        '/user#getSessionInfo',
      )

      if (sessionInfo?.isAuthenticated) {
        const hasToAcceptTC =
          sessionInfo?.requiredActionsToCompleteLogin?.includes('HasToAcceptTC')

        setRoles(sessionInfo?.roles)
        setLogged(true)
        setIsEmailVerified(sessionInfo.isEmailVerified)
        hasToAcceptTC && handleOpenModalConsent()
        setUserId(sessionInfo?.userID)

        identifier(sessionInfo?.userID, btag)

        const { cmsSessionID } = await session.call('/user#getCmsSessionID')
        setSessionId(cmsSessionID)

        if (data.remember) {
          localStorage.setItem(SESSION_STORAGE, cmsSessionID)
        } else {
          Cookies.set(SESSION_STORAGE, cmsSessionID)
        }

        // adicionar header em playerAPI
        PlayerApi.defaults.headers.common['X-SessionId'] = cmsSessionID

        const { data: wallets } = await fetchWalletOnLogin(
          cmsSessionID,
          sessionInfo?.userID,
        )

        const balance =
          wallets?.items &&
          wallets.items?.length > 0 &&
          wallets.items.find((item) => item.name === 'MainWallet').realMoney

        tracker('LOGIN', {
          event_type: 'customer',
          event_uuid: uuid(),
          event_datetime: sessionInfo.loginTime,
          event_value: String(balance),
          event_info_2: 'pt-BR',
          event_info_3: firstLogin(sessionInfo),
          userid: sessionInfo?.userID,
          event_channel: isMobile ? 'mobile' : 'desktop',
        })

        window.grecaptcha
          .execute()
          .then((response) => {
            setCaptchaResponse(response)
            window.grecaptcha.reset()
          })
          .catch((error) => {
            Sentry.captureException(error, {
              extra: {
                message: 'Falha no tratamento de Captcha',
              },
            })
          })
        await linkDevice(sessionInfo?.userID)
        return onSuccess?.(sessionInfo)
      }

      if (
        (sessionInfo?.requiredActionsToCompleteLogin?.length > 0 &&
          sessionInfo?.requiredActionsToCompleteLogin?.includes(
            'HasToAcceptTC',
          )) ||
        sessionInfo?.requiredActionsToCompleteLogin?.includes(
          'HasToSetUserConsent',
        )
      ) {
        try {
          const response = await session.call('/user#getCmsSessionID')

          const { cmsSessionID } = response
          setSessionId(cmsSessionID)
          handleOpenModalConsent()

          return onSuccess?.()
        } catch (error) {
          Sentry.captureException(error)

          return onError?.()
        }
      }
    } catch (error) {
      Sentry.captureException(error)
      return onError?.()
    }
  }

  async function silentlyLogout() {
    try {
      setNotShowMessage(true)

      await session.call('/user#logout')

      return true
    } catch (error) {
      return false
    } finally {
      setTimeout(() => {
        setNotShowMessage(false)
      }, 1000)
    }
  }

  async function handleLogin(
    data: LoginParams,
    onSuccess?: callback,
    onError?: callback,
  ) {
    const { retry = true, username, password } = data

    const request = {
      usernameOrEmail: username,
      password,
    }

    try {
      context.setLoadingAuth(true)

      const login = await session.call('/user#login', request)

      if (login.username?.length) {
        onLoginSuccess(data, onSuccess, onError)
      }

      context.setLoadingAuth(false)
      close()
      const goToPromoPage = Cookies.get('promoPage')
      if (goToPromoPage) {
        push(goToPromoPage)
        Cookies.remove('promoPage')
      }

      const gameSlug = Cookies.get('game_slug')
      if (gameSlug) {
        push(`/cassino/game/${gameSlug}`)
      }
    } catch (error) {
      if (error?.desc === ERROR_ALREADY_LOGGED && retry) {
        const completeOnSuccess = (params) => {
          onSuccess?.(params)

          context.setLoadingAuth(false)
          close()
        }

        const onErrorWithLogout = async () => {
          await silentlyLogout()

          handleLogin(
            {
              ...data,
              retry: false,
            },
            onSuccess,
            onError,
          )
        }

        return onLoginSuccess(data, completeOnSuccess, onErrorWithLogout)
      }

      Sentry.captureMessage(
        `handleLogin Error: ${handleMessages(error?.desc)} - ${JSON.stringify(
          error,
        )}`,
      )
      context.setLoadingAuth(false)
      doToast(handleMessages(error?.desc))

      return onError?.()
    }
  }

  return {
    handleLogin,
  }
}
