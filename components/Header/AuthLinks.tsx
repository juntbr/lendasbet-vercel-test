import { useSession } from '@/hooks/useSession'
import { useModal } from '@/hooks/useModal'
import { useTranslation } from 'next-i18next'
import { Button } from 'design-system/button'

export default function AuthLinks() {
  const { handleOpenModalLogin, handleOpenModalSignup } = useModal()

  const { isInitialLoginLoading } = useSession()
  const { t } = useTranslation(['common'])       

  if (!isInitialLoginLoading) {
    return (
      <div className="flex items-center space-x-3">
        <span
          className="text-xs text-white cursor-pointer hover:text-primary lg:text-sm"
          onClick={handleOpenModalLogin}
        >
          {t('Login')}
        </span>

        <Button onClick={handleOpenModalSignup}>{t('Register')}</Button>
      </div>
    )
  }
}
