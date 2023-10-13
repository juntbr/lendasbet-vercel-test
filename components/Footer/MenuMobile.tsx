import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { useTranslation } from 'next-i18next'
import { openChat } from '../Zendesk'
import { AppContext } from 'contexts/context'
import usePromotion from '@/hooks/usePromotions'
import Image from 'next/image'

export default function MenuMobile() {
  const { push, asPath } = useRouter()
  const { setActiveCategory } = usePromotion()

  const { openSideBar, setOpenSideBar } = useContext(AppContext)

  const { t } = useTranslation(['common'])

  const redirectToCassino = () => {
    push('/cassino')
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex w-full items-center justify-between border-t border-[#243030] bg-background px-4 py-2 lg:hidden">
      <div
        onClick={() => {
          setOpenSideBar(!openSideBar)
        }}
        className="flex flex-col items-center justify-center space-y-1 cursor-pointer"
      >
        <Image
          src="/images/menu.svg"
          alt="Menu"
          width={22}
          height={22}
          className="w-6 h-6"
        />
        <span className="text-[9px] text-textPrimary">{t('Menu')}</span>
      </div>

      <Link
        href="/esportes"
        className="flex flex-col items-center justify-center space-y-1 cursor-pointer"
      >
        <Image
          src="/images/soccer.svg"
          alt="bola de futebol"
          width={22}
          height={22}
          className="w-6 h-6"
        />
        <span
          data-current={asPath.includes('esportes')}
          className="text-[9px] text-textPrimary data-[current=true]:text-primary"
        >
          {t('Sports')}
        </span>
      </Link>

      <div
        onClick={redirectToCassino}
        className="flex flex-col items-center justify-center space-y-1 cursor-pointer"
      >
        <Image
          src="/images/cartas.svg"
          alt="Cartas"
          width={22}
          height={22}
          className="w-6 h-6"
        />{' '}
        <span
          data-current={asPath.includes('cassino')}
          className="text-[9px] text-textPrimary data-[current=true]:text-primary"
        >
          {t('Casino')}
        </span>
      </div>

      <button
        onClick={() => {
          setActiveCategory('')
          push('/promocoes')
        }}
        className="flex flex-col items-center justify-center space-y-1 cursor-pointer"
      >
        <Image
          src="/images/presente.svg"
          alt="Presente"
          width={22}
          height={22}
          className="w-6 h-6"
        />
        <span
          data-current={asPath.includes('promocoes')}
          className="text-[9px] text-textPrimary data-[current=true]:text-primary"
        >
          {t('Bonus')}
        </span>
      </button>

      <div
        className="flex flex-col items-center justify-center space-y-1 cursor-pointer"
        onClick={openChat}
      >
        <Image
          src="/images/suporte.svg"
          alt="Suporte"
          width={22}
          height={22}
          className="w-6 h-6"
        />
        <span className="text-[9px] text-textPrimary">{t('Help')}</span>
      </div>
    </div>
  )
}
