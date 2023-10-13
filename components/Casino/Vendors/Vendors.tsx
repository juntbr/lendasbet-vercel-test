import { Swiper, SwiperSlide } from 'swiper/react'
import { ALL_VENDORS, useCasino } from 'hooks/useCasino'
import { ArrowRightIcon } from '@heroicons/react/20/solid'
import { Autoplay } from 'swiper'
import useWindowSize from '@/hooks/UseWindowSize'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import { Button } from 'design-system/button'

export default function Vendors() {
  const { t } = useTranslation(['common'])

  const {
    setActiveCasino,
    setActiveCasinoVendor,
    setActiveCasinoVendorFilter,
  } = useCasino()

  const { isMobile } = useWindowSize()

  const SLIDES_PER_VIEW = isMobile ? 2.5 : 6
  const SPACE_BETWEEN = isMobile ? 10 : 25

  const providers = [
    {
      id: 115,
      logo: '/images/providers/nolimit-city.svg',
      name: 'NolimitCity',
      amount: 122,
    },
    {
      id: 132,
      logo: '/images/providers/pragmatic-play.svg',
      name: 'PragmaticPlay',
      amount: 503,
    },
    {
      id: 252,
      name: 'Hacksaw',
      logo: '/images/providers/hacksaw-gaming.svg',
      amount: 125,
    },

    {
      id: 263, // RGS_Matrix
      name: 'LadyLuckGames',
      logo: '/images/providers/slot-matrix.svg',
      amount: 28,
    },
    {
      id: 18, // EvolutionGaming
      name: 'Evolution',
      logo: '/images/providers/evolution.svg',
      amount: 409,
    },
    {
      id: 231,
      logo: '/images/providers/spribes.svg',
      name: 'Spribe',
      amount: 8,
    },
  ]

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex items-center justify-between w-full">
        <h2 className="font-bold text-white text-start lg:text-lg">
          {t('Vendors')}
        </h2>
        <Button
          variant="outline"
          size="small"
          endIcon={<ArrowRightIcon className="w-4 h-4 ml-1 text-primary" />}
          onClick={() => {
            setActiveCasino(ALL_VENDORS)
            window.scrollTo(0, 0)
          }}
        >
          {t('See all')}
        </Button>
      </div>
      <div className="relative flex justify-center w-full mx-auto">
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 3000 }}
          spaceBetween={SPACE_BETWEEN}
          slidesPerView={SLIDES_PER_VIEW}
          scrollbar={{ draggable: true }}
          loop={true}
        >
          {providers?.map((item, i) => (
            <SwiperSlide
              key={i}
              className="!flex cursor-pointer !items-center !justify-center rounded-lb bg-borderColor p-3 transition-all duration-300 ease-in-out hover:bg-opacity-70 lg:p-5"
              onClick={() => {
                setActiveCasinoVendorFilter(item.id)
                setActiveCasinoVendor(item.name)
                setActiveCasino('')
                window.scrollTo(0, 0)
              }}
            >
              <div className="flex flex-col items-center h-16 space-y-1">
                <Image
                  loader={({ width, quality }) =>
                    `${item.logo}?w=${width}&q=${quality || 75}`
                  }
                  className="w-24 h-full"
                  src={item.logo}
                  alt="provedor"
                  width={150}
                  height={150}
                />
                <span className="text-xs text-textPrimary">
                  {item.amount} Jogos
                </span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}
