import { useContext, useId, useEffect } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { AppContext } from '../../contexts/context'

import { GoogleLogin } from '@react-oauth/google'
import { useRouter } from 'next/router'
import useGoogleAuth from '@/hooks/useGoogleAuth'
import { useModal } from '@/hooks/useModal'
import { useAuth } from 'hooks/useAuth'
import { Input } from '../Input'
import Recaptcha from '../Recaptcha'
import { i18n, useTranslation } from 'next-i18next'
import { Button } from 'design-system/button'

export default function Login() {
  const { handleLogin } = useAuth()
  const { close, handleOpenModalSignup, handleOpenModalForgotPassword } =
    useModal()

  const { handleGoogleAuthentication } = useGoogleAuth()
  const { loadingAuth } = useContext(AppContext)

  const { t } = useTranslation(['common'])

  const validationSchema = Yup.object().shape({
    username: Yup.string().required(t('The field user is required')),
    password: Yup.string().required(t('The field password is required')),
    remember: Yup.boolean(),
  })

  const id = useId()

  const usernameId = `${id}-username`
  const passwordId = `${id}-password`
  const rememberMeId = `${id}-remember-me`

  const formOptions = {
    resolver: yupResolver(validationSchema),
  }

  const { setValue, register, handleSubmit, formState } = useForm(formOptions)
  const { errors } = formState

  const { query } = useRouter()

  useEffect(() => {
    if (query.rememberMe) {
      setValue('remember', true)
    }
  }, [])

  const callApi = (data) => {
    handleLogin(data)
  }

  return (
    <div className="flex flex-col items-center space-y-5 lg:space-y-8">
      <p className="mx-auto text-lg font-semibold leading-5 text-center text-primary lg:w-full lg:text-2xl">
        {t('Log in and start betting!')}
      </p>

      <form
        className="flex flex-col w-full space-y-4 lg:max-w-md"
        onSubmit={handleSubmit(callApi)}
      >
        <Input
          {...register('username')}
          id={usernameId}
          name="username"
          isFullWidth
          labelMessage={t('Email or username')}
          placeholder={t('Username')}
          errorMessage={errors.username}
          autoComplete="username"
        />

        <Input
          {...register('password')}
          id={passwordId}
          displayPassword={true}
          name="password"
          type="password"
          isFullWidth
          labelMessage={t('Password')}
          placeholder={t('Password')}
          errorMessage={errors.password}
          autoComplete="current-password"
        />

        <Recaptcha />

        <div className="flex items-center justify-between">
          <Input
            {...register('remember')}
            id={rememberMeId}
            name="remember"
            type="checkbox"
            labelMessage={t('Remember me')}
          />

          <p
            onClick={() => {
              close()
              handleOpenModalForgotPassword()
            }}
            className="text-xs cursor-pointer text-primary hover:text-primaryHover lg:text-sm"
          >
            {t('Forgot my password')}
          </p>
        </div>

        <Button
          className="w-full"
          size="large"
          type="submit"
          loading={loadingAuth}
        >
          {t('Login')}
        </Button>

        <div className="left-0 right-0 flex flex-col items-center space-y-4 bottom-10 lg:absolute">
          <GoogleLogin
            onSuccess={(credentialResponse) =>
              handleGoogleAuthentication(credentialResponse.credential, callApi)
            }
            onError={() => {
              console.log('Login Failed')
            }}
            useOneTap
            shape="circle"
            theme="filled_black"
            locale={i18n.language}
          />
          <div className="flex items-center justify-center space-x-2 text-xs lg:text-sm">
            <span className=" text-textPrimary">
              {t("Don't have an account?")}
            </span>
            <p
              onClick={() => {
                close()
                handleOpenModalSignup()
              }}
              className="cursor-pointer text-primary hover:text-primaryHover"
            >
              {t('Register')}
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}
