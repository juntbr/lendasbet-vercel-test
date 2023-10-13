/* eslint-disable camelcase */
import { v4 as uuid } from 'uuid'
import { memo, useCallback, useMemo } from 'react'
import convertStaticUrl from 'utils/convertStaticUrl'
import AutoPlaySilentVideo from '../AutoPlaySilentVideo'
import { useCasino } from '@/hooks/useCasino'
import Image from 'next/image'
import { Carousel } from 'design-system/carousel/Carousel'
import { KeenSliderOptions } from 'keen-slider'
import { useRouter } from 'next/router'

function Banner() {
  const { banners, isCasinoLive } = useCasino()
  const { push } = useRouter()

  const bannersLocationFilter = useMemo(() => {
    return banners?.filter((b) =>
      isCasinoLive
        ? b.acf.location.includes('live') || b.acf.location === 'both'
        : b.acf.location.includes('slot') || b.acf.location === 'both',
    )
  }, [banners, isCasinoLive])

  const bannerAction = useCallback((banner) => {
    const { interactive, interactive_type, game, open_link } = banner.acf

    if (interactive && interactive_type === 'game') {
      push(`/cassino/game/${game}`)
    }
    if (interactive && interactive_type === 'link' && open_link) {
      const anchor = document.createElement('a')
      anchor.href = open_link.url
      anchor.target = open_link.target
      anchor.title = open_link.title
      anchor.click()
    }
  }, [])

  const options: KeenSliderOptions = {
    breakpoints: {
      '(min-width: 650px)': {
        slides: { perView: 2, spacing: 20 },
      },
      '(min-width: 750px)': {
        slides: { perView: 3, spacing: 20 },
      },
    },
    slides: { perView: 1 },
    drag: true,
    loop: true,
    mode: 'snap',
  }

  const id = uuid()

  return (
    <Carousel key={id} {...options}>
      {bannersLocationFilter?.map((banner, i) => {
        const key = banner.title.rendered

        const { type, image, video } = banner.acf

        const treatedImage = image ? convertStaticUrl(image) : ''

        return (
          <div
            key={key}
            className="cursor-pointer keen-slider__slide rounded-lb"
            onClick={() => bannerAction(banner)}
          >
            {type === 'image' ? (
              <Image
                className="transition-all duration-300 ease-in-out bg-cover hover:scale-110"
                src={treatedImage ?? '/images/defaultThumbnail.png'}
                alt="banner"
                fetchPriority="high"
                fill
                sizes="100vw"
                key={key}
                loader={({ width, quality }) =>
                  `${treatedImage}?w=${width}&q=${quality || 75}`
                }
              />
            ) : (
              <AutoPlaySilentVideo src={video} key={key} />
            )}
          </div>
        )
      })}
    </Carousel>
  )
}

export const CasinoBanner = memo(Banner)
