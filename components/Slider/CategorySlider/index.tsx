import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper'
import { CategorySliderProps, PromotionObject } from './types'
import { prepareContent } from 'pages/promocoes/[slug]'
import { ArrowRightIcon } from '@heroicons/react/20/solid'
import usePromotion from '@/hooks/usePromotions'
import { useSession } from '@/hooks/useSession'
import { useTranslation } from 'next-i18next'
import { Button } from 'design-system/button'

export const CategorySlider = ({
  categoryName,
  promotionCardArray,
  handleSeeAllFunction,
  className,
  breakpoints,
}: CategorySliderProps) => {
  const { t } = useTranslation(['common'])
  const { openPromotion } = usePromotion()
  const { logged } = useSession()

  return (
    <div
      className={`flex w-full flex-col items-start justify-start gap-2 ${className}`}
    >
      <div className="flex items-center justify-between w-full mb-2">
        <h2 className="text-sm font-bold text-white text-start lg:text-base">
          {t(categoryName)}
        </h2>
        <Button
          variant="outline"
          size="small"
          endIcon={<ArrowRightIcon className="w-4 h-4 ml-1 text-primary" />}
          onClick={handleSeeAllFunction}
        >
          {t('See all')}
        </Button>
      </div>

      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
        pagination={{ clickable: true, enabled: true }}
        scrollbar={{ draggable: true }}
        spaceBetween={12}
        autoplay={{ delay: 4000 }}
        loop
        breakpoints={breakpoints}
        className="w-full"
      >
        {promotionCardArray.map((slide: PromotionObject) => {
          const { title, subtitle } = prepareContent(slide)
          return (
            <SwiperSlide key={slide.id} className="w-full">
              <Image
                src={slide.fimg_url}
                alt={title}
                width={235}
                height={150}
                sizes="100vw"
                loader={({ width, quality }) =>
                  `${slide.fimg_url}?w=${width}&q=${quality || 75}`
                }
                className="absolute h-[150px] w-full rounded-lb object-fill"
              />
              <div className="relative h-[150px] w-full rounded-lb p-2 sm:p-3">
                <button
                  className="w-full h-full"
                  onClick={() =>
                    openPromotion(`/promocoes/${slide.slug}`, logged)
                  }
                >
                  <div className="flex h-full w-[75%] flex-col items-start justify-end text-white">
                    <h2 className="font-sans text-base font-bold text-start">
                      {title}
                    </h2>
                    {subtitle && (
                      <p className="text-xs text-start text-neutral-20">
                        {subtitle}
                      </p>
                    )}
                  </div>
                </button>
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>
  )
}
