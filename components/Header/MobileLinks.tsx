import { useSession } from '@/hooks/useSession'
import AuthLinks from './AuthLinks'
import AccountMenu from './AccountMenu'
import { useModal } from '@/hooks/useModal'
import { useTranslation } from 'next-i18next'
import { SwitchLanguage } from './SwitchLanguage'
import { Button } from 'design-system/button'

export default function MobileLinks() {
  const { handleOpenModalDeposit } = useModal()

  const { logged } = useSession()

  const { t } = useTranslation(['common'])

  if (!logged) {
    return (
      <div className="flex items-center space-x-3 lg:hidden">
        <AuthLinks />
        <SwitchLanguage />
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-3 lg:hidden">
      <Button onClick={handleOpenModalDeposit}>{t('Deposit')}</Button>
      <AccountMenu />
      <SwitchLanguage />
    </div>
  )
}
