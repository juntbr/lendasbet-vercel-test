import usePromotion from '@/hooks/usePromotions'
import { CardProps } from './types'
import Image from 'next/image'
import { useSession } from '@/hooks/useSession'

export const Card = ({ bannerImg, title, subtitle, slug }: CardProps) => {
  const { openPromotion } = usePromotion()
  const { logged } = useSession()

  return (
    <div className="relative w-full h-full rounded-lb">
      <Image
        src={bannerImg}
        alt={title}
        width={256}
        height={150}
        className="absolute object-fill w-full h-full rounded-lb"
        sizes="100vw"
        loader={({ width, quality }) =>
          `${bannerImg}?w=${width}&q=${quality || 75}`
        }
      />
      <button
        className="absolute w-full h-full text-start"
        onClick={() => openPromotion(`/promocoes/${slug}`, logged)}
      >
        <div className="flex h-full w-[60%] flex-col items-start justify-end p-4 text-white">
          <h4 className="text-base font-bold">{title}</h4>
          {subtitle && (
            <h6 className="overflow-hidden text-xs tracking-wide truncate w-60 text-neutral-20">
              {subtitle}
            </h6>
          )}
        </div>
      </button>
    </div>
  )
}
