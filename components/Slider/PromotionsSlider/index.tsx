import { Swiper, SwiperSlide } from 'swiper/react'
import { PromotionsSliderProps } from './types'
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper'
import Image from 'next/image'
import { prepareContent } from 'pages/promocoes/[slug]'
import { useSession } from '@/hooks/useSession'
import usePromotion from '@/hooks/usePromotions'

export const PromotionsSlider = ({ sliders }: PromotionsSliderProps) => {
  const { openPromotion } = usePromotion()
  const { logged } = useSession()

  const MORE_THEN_ONE = sliders.length > 1
  const SLIDERS_PER_VIEW = MORE_THEN_ONE ? 1.2 : 1
  return (
    <Swiper
      modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
      loop={true}
      pagination={{ clickable: true, enabled: true }}
      scrollbar={{ draggable: true }}
      slidesPerView={1}
      spaceBetween={12}
      autoplay={{ delay: 4000 }}
      breakpoints={{
        375: {
          slidesPerView: 1,
          spaceBetween: 12,
        },
        768: {
          slidesPerView: 1.8,
          spaceBetween: 18,
        },
        1024: {
          slidesPerView: SLIDERS_PER_VIEW,
          spaceBetween: 12,
        },
        2500: {
          slidesPerView: SLIDERS_PER_VIEW,
          spaceBetween: 7,
        },
      }}
      className="w-full"
    >
      {sliders.map((promo) => {
        const { title, subtitle } = prepareContent(promo)

        return (
          <SwiperSlide key={promo.id}>
            <Image
              src={promo.fimg_url}
              alt={title}
              className="absolute h-[200px] w-full rounded-lb md:h-[260px] lg:h-[600px]"
              width={600}
              height={350}
              sizes="100vw"
              loader={({ width, quality }) =>
                `${promo.fimg_url}?w=${width}&q=${quality || 75}`
              }
            />
            <div className="relative h-[200px] w-full rounded-lb p-4 md:h-[260px] lg:h-[350px] xl:h-[500px]">
              <div
                className="h-full w-full cursor-pointer"
                onClick={() =>
                  openPromotion(`/promocoes/${promo.slug}`, logged)
                }
              >
                <div className="flex h-full w-[60%] flex-col items-start justify-end gap-2 text-white">
                  <h2 className="text-start font-sans text-xl font-bold md:text-2xl">
                    {title}
                  </h2>
                  {subtitle && (
                    <p className="text-start font-sans text-sm md:text-base">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        )
      })}
    </Swiper>
  )
}
