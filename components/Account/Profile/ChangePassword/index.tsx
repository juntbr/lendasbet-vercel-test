import React, { useEffect, useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'

import { doToast } from 'utils/toastOptions'
import { useSession } from 'hooks/useSession'
import { Input } from '@/components/Input'
import { Button } from 'design-system/button'

const validationSchema = ({ passwordValidation }) =>
  Yup.object().shape({
    oldPassword: Yup.string().required('A senha atual é obrigatória.'),
    newPassword: Yup.string()
      .required('A nova senha é obrigatória.')
      .matches(
        passwordValidation.regex,
        /* passwordValidation.message */ 'Sua senha deve conter pelo menos 8 caracteres, 1 letra e 1 número.',
      ), // TODO ajustar mensagem que retorna da api
    retryPassword: Yup.string()
      .required('A confirmação da senha é obrigatória')
      .oneOf([Yup.ref('newPassword')], 'As senhas não são iguais.'),
  })

const ChangePassword: React.FC = () => {
  const { session } = useSession()
  const [passwordValidation, setPasswordValidation] = useState({
    regex: null,
    message: '',
  })

  const formOptions = {
    resolver: yupResolver(validationSchema({ passwordValidation })),
    criteriaMode: 'firstError',
    mode: 'all',
    shouldFocusError: true,
  }

  const { register, handleSubmit, formState, reset } = useForm(formOptions)
  const { errors } = formState

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

  const handleChangePassword = async (data: any) => {
    try {
      await session.call('/user/pwd#change', {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      })

      doToast('Senha alterada com sucesso!')
      reset({
        oldPassword: '',
        newPassword: '',
        retryPassword: '',
      })
    } catch (err) {
      doToast('Erro ao tentar alterar senha, tente novamente mais tarde.')
    }
  }

  return (
    <div className="relative h-full">
      <h2 className="mb-4 text-xl font-bold text-primary">Alterar senha</h2>
      <form
        className="flex flex-col space-y-4"
        onSubmit={handleSubmit(handleChangePassword)}
      >
        <Input
          {...register('oldPassword')}
          id="oldPassword"
          name="oldPassword"
          isFullWidth
          labelMessage="Senha atual"
          placeholder="Digite a senha atual"
          errorMessage={errors.oldPassword}
        />

        <Input
          {...register('newPassword')}
          id="newPassword"
          name="newPassword"
          isFullWidth
          labelMessage="Nova senha"
          placeholder="Digite a nova senha"
          errorMessage={errors.newPassword}
        />

        <Input
          {...register('retryPassword')}
          id="retryPassword"
          name="retryPassword"
          isFullWidth
          labelMessage="Nova senha"
          placeholder="Digite novamente a nova senha"
          errorMessage={errors.retryPassword}
        />

        <Button type="submit" className="w-full">
          Salvar
        </Button>
      </form>
    </div>
  )
}

export default ChangePassword
