import { Input } from '@/components/Input'
import useWindowSize from '@/hooks/UseWindowSize'
import Image from 'next/image'
import { doToast } from 'utils/toastOptions'
import { useTranslation } from 'next-i18next'
import { Button } from 'design-system/button'

export default function WaitingForPayment({ pixPaymentCode, qrCodeImage }) {
  const { t } = useTranslation()

  function copyToClipboard() {
    navigator.clipboard.writeText(pixPaymentCode)
    doToast(t('Code copied with success'))
  }

  const { width } = useWindowSize()

  return (
    <div className="flex flex-col items-center justify-start h-full space-y-4">
      <span className="text-sm font-medium text-center cursor-pointer text-textPrimary lg:text-base">
        {t('Wait payment')}
      </span>

      <div className="bg-white">
        {width >= 1024 && (
          <Image
            height={250}
            width={250}
            src={qrCodeImage}
            alt="QR Code"
            loader={({ width, quality }) =>
              `${qrCodeImage}?w=${width}&q=${quality || 75}`
            }
          />
        )}
      </div>

      <span className="text-xs text-neutral-40 lg:hidden">
        {t('Copy the PIX code')}
      </span>
      <Input
        value={pixPaymentCode}
        onClick={() => copyToClipboard()}
        readOnly
        className="!text-textPrimary"
        isFullWidth
      />

      <Button
        size="large"
        onClick={() => copyToClipboard()}
        type="submit"
        className="w-full"
      >
        {t('Copy code')}
      </Button>
    </div>
  )
}
