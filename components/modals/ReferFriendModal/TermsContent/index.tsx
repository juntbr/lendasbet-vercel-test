import { UserGroupIcon } from '@heroicons/react/20/solid'
import { TermsContentProps } from './types'
import { useTranslation } from 'next-i18next'
import { Button } from 'design-system/button'

export const TermsContent = ({ onCLick }: TermsContentProps) => {
  const { t } = useTranslation()

  return (
    <>
      <h3 className="mx-auto mb-5 text-xl font-semibold leading-5 text-center text-primary lg:text-2xl">
        {t('Rules')}
      </h3>
      <UserGroupIcon className="h-[30px] w-[32px] text-white" />

      <h2 className="mt-2 text-lg font-semibold text-white">{t('Invite')}</h2>

      <p className="my-4 text-sm text-left text-white">
        {t('Rules invite your friends...')}
      </p>

      <div className="flex flex-col items-start justify-start gap-2 overflow-auto lg:max-h-[300px]">
        <h3 className="text-sm font-semibold text-white ">{t('Terms')}</h3>

        <ul className="flex flex-col items-start justify-start gap-2 px-5 text-xs text-left list-disc text-textPrimary lg:text-sm">
          <li>{t('Term 1')}</li>
          <li>{t('Term 2')}</li>
          <li>{t('Term 3')}</li>
          <li>{t('Term 4')}</li>
          <li>{t('Term 5')}</li>
        </ul>
      </div>

      <div className="w-full pt-4">
        <Button
          className="w-full"
          variant="secondary"
          onClick={() => onCLick()}
        >
          {t('Back button')}
        </Button>
      </div>
    </>
  )
}
