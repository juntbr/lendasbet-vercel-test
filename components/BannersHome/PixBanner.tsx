import Image from 'next/image'
import { useTranslation } from 'next-i18next'
import { useSession } from '@/hooks/useSession'
import { useModal } from '@/hooks/useModal'

export default function PixBanner() {
  const { logged } = useSession()

  const { t } = useTranslation(['common'])

  const { handleOpenModalLogin, handleOpenModalDeposit } = useModal()

  function openDeposit() {
    return logged ? handleOpenModalDeposit() : handleOpenModalLogin()
  }

  return (
    <div
      className="relative flex w-full px-8 py-2 overflow-hidden shadow rounded-lb bg-secondary lg:hidden"
      onClick={openDeposit}
    >
      <h2 className="w-48 text-base font-bold leading-6 text-white">
        {t('Fast Deposit & Withdrawal via PIX')}
      </h2>
      <Image
        src="/icons/pix.svg"
        alt="banner"
        className="absolute w-20 h-auto -top-3 right-8"
        width={100}
        height={100}
      />
    </div>
  )
}
