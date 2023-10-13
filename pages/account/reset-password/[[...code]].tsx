import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { useSession } from '@/hooks/useSession'
import { doToast } from '@/utils/toastOptions'
import { Input } from '@/components/Input'
import { Button } from 'design-system/button'

const validationSchema = ({ passwordValidation }) =>
  Yup.object().shape({
    password: Yup.string()
      .required('A nova senha é obrigatória.')
      .matches(
        passwordValidation.regex,
        /* passwordValidation.message */ 'Sua senha deve conter pelo menos 8 caracteres, 1 letra e 1 número.',
      ), // TODO ajustar mensagem que retorna da api
    retryPassword: Yup.string()
      .required('A confirmação da senha é obrigatória')
      .oneOf([Yup.ref('password')], 'As senhas não são iguais.'),
  })

const ResetPassword: React.FC = () => {
  const { session } = useSession()
  const router = useRouter()
  const { key, code } = router.query

  const [passwordCode, setPasswordCode] = useState(null)

  const [passwordValidation, setPasswordValidation] = useState({
    regex: null,
    message: '',
  })

  const redirect = async () => {
    try {
      const res = await session.call('/user/pwd#isResetPwdKeyAvailable', {
        key: passwordCode,
      })

      if (!res.isAvailable) {
        throw new Error('Invalid code')
      }
    } catch (e) {
      router.push('/cassino')
    }
  }

  useEffect(() => {
    const codeStr = key || (code && code.length > 1 ? code[0] : code)
    if (!codeStr) router.push('/cassino')
    setPasswordCode(codeStr)
  }, [key, code])

  useEffect(() => {
    if (passwordCode) {
      redirect()
    }
  }, [passwordCode])

  const formOptions = {
    resolver: yupResolver(validationSchema({ passwordValidation })),
    criteriaMode: 'firstError',
    mode: 'all',
    shouldFocusError: true,
  }

  const { register, handleSubmit, formState } = useForm(formOptions)

  const { errors, isSubmitting } = formState

  const handleChangePassword = async (data) => {
    try {
      await session.call('/user/pwd#reset', {
        key: passwordCode,
        password: data.password,
      })
      doToast('Senha alterada com sucesso!')
      router.push('/cassino')
    } catch (error) {
      doToast(
        'Não foi possível resetar a senha, tente novamente ou entre em contato!',
      )
    }
  }

  async function fetchPasswordClientSideValidation() {
    const res = await session.call('/user/pwd#getPolicy', {})

    setPasswordValidation({
      regex: new RegExp(res.regularExpression),
      message: res.message,
    })
  }

  useEffect(() => {
    fetchPasswordClientSideValidation()
  }, [])

  return (
    <form
      className="flex flex-col items-center justify-start w-full h-screen max-w-xl p-10 mx-auto space-y-4"
      onSubmit={handleSubmit(handleChangePassword)}
    >
      <h2 className="mx-auto !mb-6 text-center text-xl font-semibold leading-5 text-primary lg:text-3xl">
        Recuperar conta
      </h2>

      <Input
        {...register('password')}
        id="password"
        name="password"
        type="password"
        placeholder="Digite a senha nova"
        isFullWidth
        labelMessage="Confirmar senha"
        errorMessage={errors.password}
      />

      <Input
        {...register('retryPassword')}
        id="retryPassword"
        name="retryPassword"
        type="password"
        placeholder="Repita a nova senha"
        isFullWidth
        labelMessage="Confirmar senha"
        errorMessage={errors.retryPassword}
      />

      <Button
        type="submit"
        className="w-full"
        loading={isSubmitting}
        disabled={isSubmitting}
      >
        Alterar a senha
      </Button>
    </form>
  )
}

export default ResetPassword
