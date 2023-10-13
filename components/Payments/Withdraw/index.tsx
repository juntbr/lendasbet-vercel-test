import { useState, useMemo, useEffect, useContext } from 'react'
import axios from 'axios'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { PixType as PixTypeCaship } from 'types/caship'
import { PixType as PixTypePay4Fun } from 'services/Pay4Fun/types'

import { useAuth } from 'hooks/useAuth'
import { useBalance } from 'hooks/useBalance'

import Success from '../Success'
import ErrorFeedback from '../Error'
import { IMaskInput } from 'react-imask'

import { schema } from './schema'
import { GatewayType } from 'types/GatewayService'
import Balance from '@/components/Balance'
import { PatternFormat } from 'react-number-format'
import { useProfileData } from '@/hooks/useProfileData'
import isNotEmpty from 'utils/checkForEmpty'
import useIncompleteProfile from '@/hooks/useIncompleteProfile'
import { useTranslation } from 'next-i18next'
import CompleteRegister from '@/components/CompleteRegister'
import { useGoogleTagManager } from '@/hooks/useGoogleTagManager'
import { AppContext } from 'contexts/context'
import { Button } from 'design-system/button'

type ContentType = 'Default' | 'Error' | 'Success' | 'Redirect'

function Withdraw() {
  const { t } = useTranslation()

  const { profileData } = useProfileData()
  const { incompleteProfile } = useIncompleteProfile()
  const { sessionId } = useAuth()
  const { withdrawAbleMoney, lockedMoney, walletMutate } = useBalance()
  const { setDataLayer } = useGoogleTagManager()
  const { account } = useContext(AppContext)

  const [withdraw, setWidthdraw] = useState()
  const [withdrawType, setWithdrawType] = useState('CPF')
  const [content, setContent] = useState<ContentType>('Default')

  const {
    register,
    formState,
    handleSubmit,
    control,
    clearErrors,
    setValue,
    watch,
    getValues,
  } = useForm({
    resolver: yupResolver(schema),
    criteriaMode: 'firstError',
    mode: 'all',
    shouldFocusError: true,
  })
  const { errors, isSubmitting } = formState

  useEffect(() => {
    clearErrors('withdrawKey')
    setValue('withdrawKey', '')
    setValue('gatewayType', GatewayType.PAY4FUN)

    const cpf = profileData.personalID?.replace(/[^\d]+/g, '')
    if (isNotEmpty(cpf) && withdrawType === 'CPF') {
      setValue('withdrawKey', cpf)
    }
  }, [withdrawType, clearErrors, setValue, profileData.personalID])

  useEffect(() => {
    const EVENT_NAME = 'open-withdrawal'
    const FULL_NAME = account.firstname + ' ' + account.surname
    setDataLayer({
      event: EVENT_NAME,
      user: {
        id: account.userID,
        name: FULL_NAME,
        email: account.email,
        phone: account.phone,
      },
    })
  }, [])

  const gatewayType = watch('gatewayType')

  const PixType =
    gatewayType === GatewayType.PAY4FUN ? PixTypePay4Fun : PixTypeCaship

  const placeholder = useMemo(() => {
    switch (withdrawType) {
      case PixType.CPF:
        return '000.000.000-00'
      case PixType['Chave Aleatória']:
        return 'Chave aleatória'
      case PixType.Email:
        return 'example@exemplo.com'
      case PixType.Telefone:
        return '(99) 99999-9999'
    }
  }, [withdrawType, PixType])

  const maskType = useMemo(() => {
    switch (withdrawType) {
      case PixType.CPF:
        return '000.000.000-00'
      case 'EVP':
      case PixType['Chave Aleatória']:
        return String
      case PixType.Email:
        return String
      case PixType.Telefone:
        return '(00) 00000-0000'
    }
  }, [withdrawType, PixType])

  const sendWithdrawalRequestDataLayer = (amount = null) => {
    const EVENT_NAME = 'withdrawal-request'
    const FULL_NAME = account.firstname + ' ' + account.surname
    setDataLayer({
      event: EVENT_NAME,
      currency: 'BRL',
      method: 'PIX',
      amount,
      user: {
        id: account.userID,
        name: FULL_NAME,
        email: account.email,
        phone: account.phone,
      },
    })
  }

  async function sendWithdraw(values: any) {
    try {
      const withdrawAmount =
        typeof values.withdrawAmount === 'string'
          ? parseFloat(values.withdrawAmount)
          : parseFloat(values.withdrawAmount.toString())

      const response = await axios.post('/api/payments/withdraw', {
        amount: withdrawAmount,
        pixtype: values.withdrawPixType,
        pixkey: values.withdrawKey,
        sessionId,
        gatewayType: values.gatewayType,
      })

      const data = await response.data

      if (data.error) {
        throw new Error(data?.message ?? 'Ocorreu um erro ao realizar o saque.')
      }

      sendWithdrawalRequestDataLayer(withdrawAmount)

      await walletMutate()

      setWidthdraw({
        status: true,
        message: 'Solicitação de saque realizada! Aguarde pela aprovação.',
      })

      setContent('Success')
    } catch (error) {
      const data = error?.response.data
      setWidthdraw({
        status: false,
        message: data.message ?? 'Ocorreu um erro ao realizar o saque.',
      })
      setContent('Error')
    }
  }

  return (
    <>
      {incompleteProfile ? (
        <CompleteRegister />
      ) : (
        <>
          <p className="mx-auto mb-5 w-52 text-center text-xl font-semibold text-primary lg:text-2xl">
            {t('Withdrawal')}
          </p>
          {content === 'Default' && (
            <form
              onSubmit={handleSubmit(sendWithdraw)}
              className="flex w-full flex-col items-start space-y-4 text-white"
            >
              <Balance />
              {lockedMoney && (
                <h3 className="text-sm font-medium leading-5 text-white">
                  {t('Play with us')}
                </h3>
              )}

              <div className="flex w-full flex-col items-start space-y-1">
                <span className="cursor-pointer text-xs font-medium text-white lg:text-sm">
                  PIX
                </span>
                <p className="text-xs text-textPrimary lg:text-sm">
                  {t('About pix')}
                </p>
                <span className="!mt-3 cursor-pointer text-xs font-medium text-white lg:text-sm">
                  {t('Pix type')}
                </span>
                <select
                  {...register('withdrawPixType')}
                  id="withdrawPixType"
                  name="withdrawPixType"
                  onChange={(e) => {
                    register('withdrawPixType').onChange(e)
                    setWithdrawType(e.target.value)
                  }}
                  className=" w-full rounded-lb border-2 border-borderColor bg-secondary px-4 py-3 text-xs lg:text-sm text-white placeholder-textPrimary shadow-sm focus:border-textPrimary focus:outline-none focus:ring-0 lg:text-base"
                >
                  {Object.keys(PixType).map((type) => (
                    <option key={type} value={PixType[type]}>
                      {type}
                    </option>
                  ))}
                  <option key={'Chave Aleatória'} value="EVP">
                    Chave Aleatória
                  </option>
                </select>
              </div>

              <div className="flex w-full flex-col items-start space-y-1">
                <span className="cursor-pointer text-xs font-medium text-white lg:text-sm">
                  {t('Key type')}
                </span>

                {withdrawType === 'CPF' ? (
                  <Controller
                    name="withdrawKey"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <PatternFormat
                        {...field}
                        id="withdrawKey"
                        name="withdrawKey"
                        type="text"
                        format="###.###.###-##"
                        placeholder="xxx.xxx.xxx-xx"
                        value={getValues('withdrawKey')}
                        onValueChange={(values) => {
                          const value = values.value.replace(/\D/g, '')
                          setValue('withdrawKey', value)
                        }}
                        disabled
                        className=" w-full rounded-lb border-2 border-borderColor bg-secondary px-4 py-3 text-xs lg:text-sm text-white placeholder-textPrimary shadow-sm focus:border-textPrimary focus:outline-none focus:ring-0 lg:text-base"
                      />
                    )}
                  />
                ) : (
                  <>
                    <Controller
                      name="withdrawKey"
                      control={control}
                      render={({ field: { onChange, ...fieldRest } }) => (
                        <IMaskInput
                          {...fieldRest}
                          mask={maskType}
                          onAccept={(value) => {
                            onChange(value ?? '')
                          }}
                          className=" w-full rounded-lb border-2 border-borderColor bg-secondary px-4 py-3 text-xs lg:text-sm text-white placeholder-textPrimary shadow-sm focus:border-textPrimary focus:outline-none focus:ring-0 lg:text-base"
                          placeholder={placeholder}
                        />
                      )}
                    />
                    {errors.withdrawKey?.message && (
                      <p className="mt-1 text-left text-xs text-red-500 lg:text-sm">
                        {String(errors.withdrawKey?.message)}
                      </p>
                    )}
                  </>
                )}
              </div>

              <div className="flex w-full flex-col items-start space-y-1 text-white">
                <span className="cursor-pointer text-xs font-medium text-white lg:text-sm">
                  {t('Value')}
                </span>
                <span className="text-xs text-textPrimary lg:text-sm">
                  {t('Minimun Value')} R$ 20,00
                </span>
                <span className="text-xs text-primary lg:text-sm">
                  {t('Available for withdraw')} {withdrawAbleMoney}
                </span>
                <input
                  {...register('withdrawAmount')}
                  type="number"
                  className=" w-full rounded-lb border-2 border-borderColor bg-secondary px-4 py-3 text-xs lg:text-sm text-white placeholder-textPrimary shadow-sm focus:border-textPrimary focus:outline-none focus:ring-0 lg:text-base"
                  placeholder="R$ 5.000,00"
                />
                {errors.withdrawAmount?.message && (
                  <p className="mt-1 text-left text-xs text-red-500 lg:text-sm">
                    {String(errors.withdrawAmount?.message)}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                {t('Withdraw')}
              </Button>
            </form>
          )}
          {content === 'Success' && (
            <Success message={withdraw?.message || ''} />
          )}
          {content === 'Error' && (
            <ErrorFeedback message={withdraw?.message || ''} />
          )}
        </>
      )}
    </>
  )
}

export default Withdraw
