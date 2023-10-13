import axios from 'axios'
import Cookies from 'js-cookie'
import * as Sentry from '@sentry/browser'
import { useCallback, useContext, useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid'
import dayjs from 'dayjs'
import { yupResolver } from '@hookform/resolvers/yup'
import { GoogleLogin } from '@react-oauth/google'
import { useForm } from 'react-hook-form'
import { PatternFormat } from 'react-number-format'
import { useGoogleTagManager } from '@/hooks/useGoogleTagManager'
import { Input } from '@/components/Input'
import Recaptcha from '@/components/Recaptcha'
import { useAffiliatePixel } from '@/hooks/useAffiliatePixel'
import { useAuth } from '@/hooks/useAuth'
import useGoogleAuth from '@/hooks/useGoogleAuth'
import { useModal } from '@/hooks/useModal'
import { useSession } from '@/hooks/useSession'
import { AppContext } from 'contexts/context'
import { handleMessages } from 'hooks/useSession/helper/handleMessages'
import isNotEmpty from 'utils/checkForEmpty'
import { doToast } from 'utils/toastOptions'
import { AFFILIATE_CODE, REFER_FRIEND_CODE } from '../../../constants'
import { useSchema } from './useSchema'
import { useOptix } from '@/hooks/useOptix'
import { useTranslation } from 'next-i18next'
import { SessionInfoResponse } from '@/hooks/useAuth/types'
import { Button } from 'design-system/button'

export const SignUpForm = () => {
  const { session } = useSession()
  const { handleLogin } = useAuth()
  const { handleGoogleRegistration } = useGoogleAuth()
  const { dispatchAffiliateEvent } = useAffiliatePixel()
  const { tracker } = useOptix()
  const { handleOpenModalDeposit, close } = useModal()
  const { t, i18n } = useTranslation(['common'])
  const { setDataLayer } = useGoogleTagManager()

  const { userCpfData } = useContext(AppContext)

  const [passwordValidation, setPasswordValidation] = useState({
    regex: null,
    message: '',
  })

  const [loading, setLoading] = useState(false)

  const validationSchema = useSchema({
    session,
    passwordValidation,
  })

  const fetchPasswordClientSideValidation = useCallback(async () => {
    const res = await session.call('/user/pwd#getPolicy', {})

    setPasswordValidation({
      regex: new RegExp(res.regularExpression),
      message: res.message,
    })
  }, [session])

  useEffect(() => {
    fetchPasswordClientSideValidation()
  }, [fetchPasswordClientSideValidation])

  const { register, handleSubmit, formState, setValue, watch } = useForm({
    resolver: yupResolver(validationSchema),
    criteriaMode: 'all',
    mode: 'all',
  })

  const { errors } = formState

  const phone = watch('phone')

  function callLogin(data) {
    setLoading(true)
    handleLogin(data, (loginSuccessData: SessionInfoResponse) => {
      doToast(t('Registration successfully completed!'))
      close()

      if (loginSuccessData?.userID) {
        const usedReferCode = Cookies.get(REFER_FRIEND_CODE) ?? null

        axios
          .post('/api/referfriend', {
            partnerUserId: loginSuccessData?.userID,
            usedReferCode,
          })
          .then(() => {
            Cookies.remove(REFER_FRIEND_CODE)
          })
          .catch((error) => {
            Sentry.captureException(error)
          })

        const FULL_NAME =
          loginSuccessData.firstname + ' ' + loginSuccessData.surname
        setDataLayer({
          event: 'signup-success',
          user: {
            id: loginSuccessData?.userID,
            name: FULL_NAME,
            email: loginSuccessData.email,
            phone,
            document: userCpfData?.cpf,
          },
        })
      }
      setLoading(false)
      dispatchAffiliateEvent({ type: 'registration' })
      handleOpenModalDeposit()
    })
  }

  const callApiSubmit = async (data) => {
    const paramsForCompleteProfile = {
      gender: 'M',
      phone: data.phone,
      postalCode: '00000000',
      address1: 'officeLendas',
      address2: 'officeLendas',
      city: 'officeLendas',
      region: 1083,
      country: 'officeLendas',
    }

    // it is important to have the title with a dot at the end
    const title = 'Mr.'

    const request = {
      ...data,
      ...paramsForCompleteProfile,
      currency: 'BRL',
      emailVerificationURL: `${process.env.NEXT_PUBLIC_BASE_URL}/account/active/`,
      phonePrefix: '+55',
      mobilePrefix: '+55',
      mobile: data.phone,
      title,
      country: 'BR',
      language: 'pt-br', // backoffice?
      userConsents: {
        termsandconditions: true,
        emailmarketing: false,
        sms: false,
        smsandemail: false,
        '3rdparty': true,
      },
    }

    if (isNotEmpty(userCpfData?.cpf)) {
      const cpf = userCpfData.cpf.replace(/\D/g, '')
      request.personalId = cpf
    }

    if (isNotEmpty(userCpfData?.birthdate)) {
      request.birthDate = userCpfData.birthdate
    }

    if (isNotEmpty(userCpfData?.name)) {
      const name = userCpfData.name
      const firstName = name.split(' ')[0]
      const surname = name.substring(firstName.length).trim()
      request.firstname = firstName
      request.surname = surname
    }

    if (isNotEmpty(Cookies.get(AFFILIATE_CODE))) {
      request.affiliateMarker = Cookies.get(AFFILIATE_CODE)
    }

    try {
      // TODO register seja feito por uma api do next
      setLoading(true)
      await session.call('/user/account#register', request)

      tracker('REGISTRATION', {
        event_type: 'customer',
        event_uuid: uuid(),
        event_datetime: dayjs().format(),
        event_value: 'advertiser',
        event_info_1: 'referrer',
        event_info_2: 'pt-BR',
        // userid: userId,
      })

      callLogin({ username: data.username, password: data.password })
    } catch (error) {
      setLoading(false)
      Sentry.captureMessage(
        'SignUpModal Error: ' +
          handleMessages(error?.desc) +
          ' - ' +
          JSON.stringify(error),
      )
      doToast(handleMessages(error?.desc))
    }
  }

  return (
    <form
      className="flex w-full flex-col space-y-4 lg:max-w-md"
      onSubmit={handleSubmit(callApiSubmit)}
    >
      <Input
        {...register('username')}
        id="username"
        name="username"
        isFullWidth
        labelMessage={t('Username')}
        placeholder={t('Username')}
        errorMessage={errors.username}
      />

      <Input
        {...register('email')}
        id="email"
        name="email"
        isFullWidth
        labelMessage={t('Email')}
        placeholder={t('Email')}
        errorMessage={errors.email}
      />

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-neutral-10"
        >
          {t('Phone')}
        </label>
        <div>
          <PatternFormat
            {...register('phone')}
            id="phone"
            name="phone"
            type="text"
            autoComplete="tel"
            placeholder={t('Phone')}
            format="(##) #####-####"
            onValueChange={(values) => setValue('phone', values.value)}
            className=" mt-0.5 w-full rounded-lb border-2 border-borderColor bg-secondary px-4 py-3 text-xs lg:text-sm text-white placeholder-textPrimary shadow-sm focus:border-textPrimary focus:outline-none focus:ring-0"
          />
          {errors.phone?.message && (
            <p className="mt-1 text-xs text-red-500 lg:text-sm">
              {errors.phone?.message?.toString()}
            </p>
          )}
        </div>
      </div>

      <Input
        {...register('password')}
        id="password"
        name="password"
        type="password"
        isFullWidth
        labelMessage={t('Password')}
        placeholder={t('Password')}
        errorMessage={errors.password}
      />

      <Input
        {...register('retryPassword')}
        id="retryPassword"
        name="retryPassword"
        type="password"
        isFullWidth
        labelMessage={t('Confirm password')}
        placeholder={t('Confirm password')}
        errorMessage={errors.retryPassword}
      />

      <Input
        {...register('terms')}
        id="terms"
        name="terms"
        type="checkbox"
        labelMessage={t('I accept the terms & conditions')}
        errorMessage={errors.terms}
      />

      <Input
        {...register('years')}
        id="years-old"
        name="years"
        type="checkbox"
        labelMessage={t('I am over 18 years old')}
        errorMessage={errors.years}
      />

      <Recaptcha />

      <div className="flex flex-col items-center space-y-5">
        <Button loading={loading} type="submit" className="w-full" size="large">
          {t('Register')}
        </Button>

        <GoogleLogin
          onSuccess={(credentialResponse) =>
            handleGoogleRegistration(
              credentialResponse.credential,
              userCpfData?.cpf,
              callLogin,
            )
          }
          onError={() => {
            console.log('Login Failed')
          }}
          text="continue_with"
          useOneTap
          shape="circle"
          theme="filled_black"
          locale={i18n.language}
        />
      </div>
    </form>
  )
}
