import useSidebar from '@/hooks/useSidebar'
import usePromotion from '@/hooks/usePromotions'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'

export default function Promotions() {
  const { t } = useTranslation(['common'])

  const promotions = [
    {
      title: t('Apostas Esportivas'),
      slug: 'apostas-esportivas',
      icon: '/images/soccer.svg',
    },
    {
      title: t('Cassino'),
      slug: 'cassino',
      icon: '/images/cartas.svg',
    },
  ]

  const { closeMenu } = useSidebar()
  const { setActiveCategory } = usePromotion()
  const { push } = useRouter()

  return (
    <div className="w-full">
      <ul className="flex flex-col items-start justify-center px-1 space-y-4">
        {promotions?.map((promo) => (
          <button
            key={promo.slug}
            onClick={() => {
              push(`/promocoes`)
              setActiveCategory(promo.slug)
              closeMenu()
            }}
            title={promo.title}
            className="flex items-center w-full space-x-3"
          >
            <Image
              src={promo.icon}
              alt={promo.slug}
              width={18}
              height={18}
              className="w-5 h-5"
            />
            <span className="text-sm transition-all duration-300 ease-in-out cursor-pointer whitespace-nowrap text-neutral-20 hover:text-white">
              {promo.title}
            </span>
          </button>
        ))}
      </ul>
    </div>
  )
}
