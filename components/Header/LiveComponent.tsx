import { useTranslation } from 'react-i18next'

export function LiveComponent() {
  const { t } = useTranslation(['common'])

  return (
    <div className="flex items-center justify-center p-1 space-x-1 bg-red-500 rounded">
      <p className="mt-[1px] text-[9px] uppercase leading-none text-white sm:text-[10px]">
        {t('live')}
      </p>
      <div className="mb-0.5 h-1.5 w-1.5 rounded-full bg-white" />
    </div>
  )
}
