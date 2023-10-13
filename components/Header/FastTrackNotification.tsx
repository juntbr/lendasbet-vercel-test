import { useTranslation } from 'next-i18next'
import { BellAlertIcon } from '@heroicons/react/20/solid'
import { useEffect } from 'react'

export default function FastTrackNotification() {
  const { t } = useTranslation(['common'])

  const openInbox = () => {
    if (window.FasttrackCrm) {
      window.FasttrackCrm.toggleInbox()
    }
  }

  useEffect(() => {
    if (window.FastTrackLoader) {
      new window.FastTrackLoader()
    }
  }, [])

  return (
    <button
      onClick={openInbox}
      className="flex flex-col items-center space-y-1 transition-all duration-300 ease-in-out cursor-pointer"
    >
      <div className="relative">
        <BellAlertIcon className="text-textPrimary flex h-auto w-[30px] lg:w-8" />
        <span className="absolute -right-1 top-0 h-3.5 w-3.5 rounded-full bg-red-500" />
      </div>
      <p className="text-xs text-white">{t('Messages')}</p>
    </button>
  )
}
