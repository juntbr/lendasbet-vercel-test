import Image from 'next/image'
import { openChat } from '../Zendesk'
import { useTranslation } from 'next-i18next'
import { Button } from 'design-system/button'

export default function Error({ message }) {
  const { t } = useTranslation(['common'])

  return (
    <div className="flex items-center justify-center w-full">
      <div className="flex flex-col items-center w-full space-y-4">
        <Image
          src="/images/error.svg"
          className="w-12 h-12"
          alt="Error icon"
          width={48}
          height={24}
        />
        <span className="text-center text-white w-44 lg:w-72 lg:text-xl">
          {typeof message === 'string'
            ? message
            : t('An unexpected error has occurred.')}
        </span>
        <div className="flex flex-row items-center justify-center">
          <span className="mb-1 text-xs text-neutral-40 lg:text-sm">
            {t('Need help?')}
          </span>
        </div>

        <Button onClick={openChat} className="w-full">
          {t('Call the support')}
        </Button>
      </div>
    </div>
  )
}
