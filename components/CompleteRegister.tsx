import { useRouter } from 'next/router'
import useWindowSize from '@/hooks/UseWindowSize'
import { useModal } from '@/hooks/useModal'
import { useTranslation } from 'next-i18next'
import { Button } from 'design-system/button'

export default function CompleteRegister() {
  const { t } = useTranslation(['common'])

  const { push } = useRouter()
  const { isMobile } = useWindowSize()

  const { close, handleOpenModalAccount } = useModal()

  const toProfile = () => {
    close()
    if (isMobile) {
      handleOpenModalAccount()
      return
    }
    push('/account')
  }

  return (
    <div className="grid w-full h-full divide-x-2 divide-neutral-70">
      <div className="flex flex-col">
        <div className="flex flex-col items-center justify-start w-full p-3 py-20 space-y-4 sm:py-10">
          <h1 className="text-xl font-bold text-center text-neutral-10 lg:text-2xl">
            {t(
              'You need to complete your registration to access this feature.',
            )}
          </h1>

          <Button onClick={toProfile}>{t('Complete registration')}</Button>
        </div>
      </div>
    </div>
  )
}
