import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'

import { useSession } from '../../hooks/useSession'
import { doToast } from 'utils/toastOptions'

import Recaptcha from '../Recaptcha'
import { Input } from '../Input'
import { useModal } from '@/hooks/useModal'
import { useTranslation } from 'next-i18next'
import { Button } from 'design-system/button'

export default function ForgotPassword() {
  const { session } = useSession()
  const { close } = useModal()
  const { handleOpenModalLogin } = useModal()
  const { t } = useTranslation(['common'])

  const validationSchema = Yup.object().shape({
    email: Yup.string().required(t('The email field is required')),
  })
  const formOptions = {
    resolver: yupResolver(validationSchema),
  }

  const { register, handleSubmit, formState } = useForm(formOptions)
  const { errors } = formState

  const callApiSubmit = async (data) => {
    try {
      const verifyEmail = await session.call('/user/account#validateEmail', {
        email: data.email,
      })
      if (verifyEmail.isAvailable) {
        doToast(t('Email not registered in the platform.'))
        return false
      }
    } catch (e) {
      console.log('tivemos um erro na validação de email.')
      return false
    }

    try {
      const token = await window.grecaptcha.execute()

      const request = {
        email: data.email,
        changePwdURL: `${process.env.NEXT_PUBLIC_BASE_URL}/account/reset-password?key=`,
        captchaPublicKey: process.env.NEXT_PUBLIC_RECAPTCHA_KEY,
        captchaResponse: token,
      }

      await session.call('/user/pwd#sendResetPwdEmail', request)
      doToast(t('Recovery email sent!'))
      close()

      window.grecaptcha.reset()
    } catch (error) {
      doToast(
        t('Password reset was not possible, please try again or contact us!'),
      )
    }
  }

  return (
    <div className="flex flex-col items-center space-y-5 lg:space-y-8">
      <Recaptcha />
      <h2 className="mx-auto mb-5 text-lg font-semibold text-center text-primary lg:text-2xl">
        {t('Forgot my password')}
      </h2>

      <p className="mx-auto text-sm font-semibold text-center w-72 text-textPrimary">
        {t('Fill in the field below to receive the recovery email')}
      </p>

      <form
        className="flex flex-col w-full space-y-4 lg:max-w-md"
        onSubmit={handleSubmit(callApiSubmit)}
      >
        <Input
          {...register('email')}
          id="email"
          name="email"
          isFullWidth
          labelMessage={t('Email')}
          placeholder={t('name@email.com')}
          errorMessage={errors.email}
        />

        <Button size="large" type="submit">
          {t('Recover password')}
        </Button>
      </form>

      <div className="flex items-center justify-center pt-4 space-x-2 text-xs lg:text-sm">
        <span className="text-textPrimary">{t('Or instead')}</span>
        <p
          onClick={() => {
            close()
            handleOpenModalLogin()
          }}
          className="cursor-pointer text-primary"
        >
          {t('Login')}
        </p>
      </div>
    </div>
  )
}
