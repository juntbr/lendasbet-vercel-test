import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { GatewayType } from 'types/GatewayService'
import { DepositResponse } from 'types/caship'
import * as yup from 'yup'
import { Input } from '../../Input'

import { RedirectScreen } from '@/components/RedirectScreen'
import CompleteRegister from '../../CompleteRegister'
import Error from '../Error'
import Success from '../Success'

import Image from 'next/image'
import { NumericFormat } from 'react-number-format'
import AddNumberSelector from './AddNumberSelector'
import SelectGateway from './SelectGateway'
import WaitingForPayment from './WaitingForPayment'
import useBonusRules from './useBonusRules'
import useDeposit from './useDeposit'
import { useTranslation } from 'next-i18next'
import allowedGateways, { sortByOrder } from '../../../utils/allowedGateways'
import { useGetCustomerServiceParam } from '@/hooks/useGetCustomerServiceParam'
import { DepositResponsePaag } from 'services/Paag/types'
import { DepositResponsePay4Fun } from 'services/Pay4Fun/types'
import { Button } from 'design-system/button'

export enum StatusPayment {
  SUCCESS = 1,
  ERROR = 2,
}

export interface PaymentDepositResponse {
  error: boolean
  data: DepositResponse | DepositResponsePay4Fun | DepositResponsePaag
  message: string
}

const gateways = allowedGateways()

const initialOptionsState = [
  {
    id: '1',
    value: GatewayType.CASHIP,
    logo: '/images/gateways/caship-logo.png',
  },
  {
    id: '2',
    value: GatewayType.PAAG,
    logo: '/images/gateways/paag.png',
  },
  {
    id: '3',
    value: GatewayType.PAY4FUN,
    logo: '/images/gateways/p4f.svg',
  },
]

const filteredOptions = sortByOrder(
  initialOptionsState.filter((option) => gateways.includes(option.value)),
  gateways,
)

const options =
  filteredOptions.length > 0 ? filteredOptions : initialOptionsState

export default function Deposit() {
  const { t } = useTranslation()

  const createUserForm = useForm({
    resolver: yupResolver(
      yup.object().shape({
        depositAmount: yup
          .number()
          .typeError('')
          .when('gatewayType', (value: any) => {
            const defaultBehavior = yup
              .number()
              .transform((value) => (isNaN(value) ? undefined : value))
              .min(10, t('Minimun Value Message'))
              .required(t('Minimun Value Message'))
            if (!value) return defaultBehavior
            if (value.lenght === 0) return defaultBehavior
            if (value[0] === GatewayType.PAY4FUN) {
              return yup
                .number()
                .transform((value) => (isNaN(value) ? undefined : value))
                .min(10, t('Minimun Value Message'))
                .required(t('Minimun Value Message'))
            }
            return defaultBehavior
          }),
        bonusCode: yup.string().nullable(),
        gatewayType: yup
          .mixed<GatewayType>()
          .oneOf(Object.values(GatewayType))
          .required(),
      }),
    ),
    criteriaMode: 'firstError',
    mode: 'all',
    shouldFocusError: true,
  })

  const { setValue, watch, control, register, formState, handleSubmit } =
    createUserForm

  const { errors } = formState

  const {
    payment,
    content,
    pixPaymentCode,
    qrCodeImage,
    redirectTo,
    handleGeneratePayment,
    isProfileIncomplete,
    isLoading,
  } = useDeposit({ setValue })

  const { getBonusMinValueByName, openBonusModal } = useBonusRules()

  useGetCustomerServiceParam()

  useEffect(() => {
    setValue('gatewayType', options.length > 0 ? options[0].value : 'CASHIP')
  }, [])

  async function generatePayment(values) {
    const bonusMinValue = getBonusMinValueByName(values.bonusCode)

    if (bonusMinValue) {
      const amountToComplete = bonusMinValue - values.depositAmount
      if (values.depositAmount < bonusMinValue) {
        openBonusModal(bonusMinValue, amountToComplete, values)
      }
    }
    handleGeneratePayment(values, undefined)
  }

  return (
    <>
      {isProfileIncomplete ? (
        <CompleteRegister />
      ) : (
        <div className="w-full h-full overflow-x-hidden">
          {content !== 'Error' && (
            <p className="mx-auto mb-5 text-xl font-semibold text-center w-52 text-primary lg:text-2xl">
              {t('Make a deposit')}
            </p>
          )}

          {content === 'Default' && (
            <div className="flex flex-col w-full space-y-6">
              <FormProvider {...createUserForm}>
                <form
                  onSubmit={handleSubmit(generatePayment)}
                  className="flex flex-col space-y-5"
                >
                  <div className="flex justify-center w-full">
                    <Image
                      src="/images/logo-pix.svg"
                      width={100}
                      height={100}
                      className="w-24 h-auto"
                      alt="Pix"
                    />
                  </div>

                  <SelectGateway options={options} />

                  <AddNumberSelector
                    name="depositAmount"
                    items={[50, 200, 500]}
                    value={watch('depositAmount')}
                    setValue={setValue}
                  />

                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-white cursor-pointer lg:text-sm">
                      {t('Value')}
                    </span>
                    <span className="mb-1 text-xs text-textPrimary lg:text-sm">
                      {t('Minimun Value')} R$ 10,00
                    </span>
                    <Controller
                      control={control}
                      name="depositAmount"
                      render={({ field: { name, value } }) => (
                        <NumericFormat
                          autoComplete="tel"
                          placeholder="R$ 0,00"
                          className={`${
                            errors.depositAmount ? 'border-red-500 ' : ''
                          }  rounded-lb border-2 border-borderColor bg-secondary px-4 py-3 text-xs text-white placeholder-textPrimary shadow-sm focus:border-textPrimary focus:outline-none focus:ring-0 lg:text-sm`}
                          thousandSeparator="."
                          decimalSeparator=","
                          prefix="R$ "
                          allowLeadingZeros={false}
                          allowNegative={false}
                          name={name}
                          value={value}
                          decimalScale={2}
                          valueIsNumericString={true}
                          onValueChange={({ value }) => {
                            setValue('depositAmount', Number(value))
                          }}
                        />
                      )}
                    />
                    {errors.depositAmount?.message && (
                      <p className="col-span-4 mt-1 text-sm text-left text-red-500">
                        {String(errors.depositAmount?.message)}
                      </p>
                    )}
                  </div>

                  <Input
                    {...register('bonusCode')}
                    id="bonusCode"
                    name="bonusCode"
                    isFullWidth
                    labelMessage={t('Bonus')}
                    placeholder={t('Bonus code')}
                    errorMessage={errors.bonusCode}
                  />

                  <Button
                    size="large"
                    type="submit"
                    loading={isLoading}
                    disabled={isLoading}
                  >
                    {t('Deposit')}
                  </Button>
                </form>
              </FormProvider>
            </div>
          )}

          {content === 'QrCode' && (
            <WaitingForPayment
              pixPaymentCode={pixPaymentCode}
              qrCodeImage={qrCodeImage}
            />
          )}
          {content === 'Redirect' && <RedirectScreen redirectTo={redirectTo} />}
          {content === 'Success' && (
            <Success message={payment?.message || ''} />
          )}
          {content === 'Error' && <Error message={payment?.message || ''} />}
        </div>
      )}
    </>
  )
}
