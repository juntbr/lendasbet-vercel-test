import formatMoney from 'utils/formatMoney'
import Error from '../Error'

import { RedirectScreen } from '@/components/RedirectScreen'
import Success from '../Success'
import WaitingForPayment from './WaitingForPayment'
import useDeposit from './useDeposit'
import { Button } from 'design-system/button'

export default function BonusModal({
  minValue,
  amountToComplete,
  values,
  bonusCode,
}) {
  const {
    payment,
    content,
    handleGeneratePayment,
    pixPaymentCode,
    qrCodeImage,
    redirectTo,
    isLoading,
  } = useDeposit({})

  return (
    <>
      {content === 'Default' && (
        <div className="p-1">
          <h2 className="mx-auto my-5 text-xl font-semibold text-center text-primary lg:text-2xl">
            O depósito mínimo para receber o bônus é de {formatMoney(minValue)}
          </h2>
          <div className="flex flex-col p-2 mt-5 space-y-4">
            <Button
              className="w-full"
              loading={isLoading}
              disabled={isLoading}
              onClick={() =>
                handleGeneratePayment(
                  {
                    ...values,
                    depositAmount: values.depositAmount + amountToComplete,
                  },
                  bonusCode,
                )
              }
            >
              Ganhar bônus
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleGeneratePayment(values, bonusCode)}
            >
              Continuar sem o bônus
            </Button>
          </div>
        </div>
      )}

      {content === 'QrCode' && (
        <WaitingForPayment
          pixPaymentCode={pixPaymentCode}
          qrCodeImage={qrCodeImage}
        />
      )}
      {content === 'Redirect' && <RedirectScreen redirectTo={redirectTo} />}
      {content === 'Success' && <Success message={payment?.message || ''} />}
      {content === 'Error' && <Error message={payment?.message || ''} />}
    </>
  )
}
