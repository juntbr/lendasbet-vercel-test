import { useEffect } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'
import Cookies from 'js-cookie'
import { SubmitHandler, useForm } from 'react-hook-form'
import { doToast } from 'utils/toastOptions'

import * as yup from 'yup'
import { OfferUnloggedModalDataProps } from './types'
import { Input } from '../Input'
import { useRouter } from 'next/router'
import { useModal } from '@/hooks/useModal'
import usePromotion from '@/hooks/usePromotions'
import { Button } from 'design-system/button'

const schema = yup.object().shape({
  email: yup.string().email().required(),
})

export const OfferUnloggedModal = () => {
  const { push } = useRouter()
  const { close, handleOpenModalLogin } = useModal()
  const { currentPromo } = usePromotion()

  const { register, handleSubmit, reset } =
    useForm<OfferUnloggedModalDataProps>({
      resolver: yupResolver(schema),
    })

  useEffect(() => {
    Cookies.set('promoPage', currentPromo)
  }, [currentPromo])

  const handleSendEmail: SubmitHandler<OfferUnloggedModalDataProps> = (
    values,
  ) => {
    axios.post('/api/offers', { email: values.email })
    Cookies.set('hasSubscribedEmail', 'true', { expires: 60 })
    reset()
    doToast('Email enviado com sucesso')
    close()
    push(currentPromo)
    Cookies.remove('promoPage')
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full max-w-md py-4 mx-auto space-y-4">
        <h1 className="font-semibold text-center text-white sm:max-w-full sm:text-2xl">
          Para acessar essa promoção é necessário
        </h1>

        <Button
          variant="primary"
          className="w-full lg:w-[328px]"
          onClick={() => {
            close()
            handleOpenModalLogin()
          }}
        >
          Fazer login
        </Button>

        <p className="italic font-bold text-textPrimary">ou</p>
        <form
          onSubmit={handleSubmit(handleSendEmail)}
          className="flex flex-col items-center justify-center space-y-2 lg:w-[328px]"
        >
          <Input
            labelMessage="Insira seu melhor e-mail:"
            className="w-full"
            {...register('email')}
            placeholder="email@gmail.com"
          />

          <Button
            className="w-full lg:w-[328px]"
            variant="primary"
            type="submit"
          >
            Enviar
          </Button>
        </form>
      </div>
    </>
  )
}
