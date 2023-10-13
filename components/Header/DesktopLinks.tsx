import { useSession } from '@/hooks/useSession'
import { useRouter } from 'next/router'
import { openChat } from '../Zendesk'
import AuthLinks from './AuthLinks'
import AccountMenu from './AccountMenu'
import { useModal } from '@/hooks/useModal'
import usePromotion from '@/hooks/usePromotions'
import useClientTranslation from '../../hooks/useClientTranslation'
import { SwitchLanguage } from './SwitchLanguage'
import Image from 'next/image'
import { Button } from 'design-system/button'

export default function DesktopLinks() {
  const { push } = useRouter()
  const { logged } = useSession()
  const { setActiveCategory } = usePromotion()

  const { handleOpenModalDeposit } = useModal()

  const { t } = useClientTranslation(['common'])

  return (
    <div className="items-center justify-between hidden lg:flex">
      <div className="items-center hidden space-x-2 lg:flex lg:space-x-4">
        {logged ? (
          <Button onClick={handleOpenModalDeposit}>{t('Deposit')}</Button>
        ) : (
          <AuthLinks />
        )}

        {logged && <AccountMenu />}

        <button
          onClick={() => {
            setActiveCategory('')
            push('/promocoes')
          }}
          className="flex flex-col items-center space-y-1 transition-all duration-200 ease-in-out group"
        >
          <Image
            src="/images/presente.svg"
            alt="promocoes"
            width="32"
            height="32"
            className="w-8 h-8"
          />
        </button>

        <button
          className="flex flex-col items-center space-y-1 cursor-pointer group"
          onClick={openChat}
        >
          <Image
            src="/images/suporte.svg"
            alt="suporte"
            width="32"
            height="32"
            className="w-8 h-8"
          />
        </button>

        <SwitchLanguage />
      </div>
    </div>
  )
}
