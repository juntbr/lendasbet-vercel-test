import { MouseEvent, ReactNode, useEffect, useState } from 'react'
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from '@heroicons/react/24/solid'
import { KeenSliderOptions } from 'keen-slider'
import { useKeenSlider } from 'keen-slider/react'

function ArrowCarousel({ loaded, instanceRef }) {
  return (
    loaded &&
    instanceRef.current && (
      <>
        <ArrowLeftCircleIcon
          data-testid="arrow-prev"
          className="absolute -left-4 top-[45%] h-8 w-8 cursor-pointer text-[#9FABA1] hover:text-[#1FBC53]"
          onClick={(e: MouseEvent<SVGSVGElement>) =>
            e.stopPropagation
              ? e.stopPropagation()
              : instanceRef.current?.prev()
          }
        />

        <ArrowRightCircleIcon
          data-testid="arrow-next"
          className="absolute -right-4 top-[45%] h-8 w-8 cursor-pointer text-[#9FABA1] hover:text-[#1FBC53]"
          onClick={(e: MouseEvent<SVGSVGElement>) =>
            e.stopPropagation
              ? e.stopPropagation()
              : instanceRef.current?.next()
          }
        />
      </>
    )
  )
}

function DotsCarousel({ loaded, instanceRef, currentSlide }) {
  const slideCount = instanceRef?.current?.track?.details?.slides?.length
  const slideIndices = Array.from({ length: slideCount }, (_, index) => index)

  return (
    loaded &&
    instanceRef.current && (
      <div
        data-testid="dots"
        className="absolute bottom-0 left-[40%] flex justify-center space-x-2 py-2 lg:left-[47.5%]"
      >
        {slideIndices.map((idx) => {
          return (
            <button
              data-testid={`dot-button-${idx}`}
              key={idx}
              onClick={() => instanceRef.current?.moveToIdx(idx)}
              data-current={currentSlide === idx}
              className="h-2 w-2 cursor-pointer rounded-full bg-[#9FABA1] data-[current=true]:bg-primary lg:h-3 lg:w-3"
            ></button>
          )
        })}
      </div>
    )
  )
}

interface CarouselProps extends KeenSliderOptions {
  children: ReactNode
  hasArrows?: boolean
  hasDots?: boolean
  delay?: number
}

export function Carousel({
  children,
  hasArrows = false,
  hasDots = false,
  delay = 5000,
  ...options
}: CarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loaded, setLoaded] = useState(false)

  const defaultOptions = {
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel)
    },
    created() {
      setLoaded(true)
    },
  }

  const HAS_ACTIONS = hasArrows || hasDots

  const optionsKeenSlider = HAS_ACTIONS
    ? { ...options, ...defaultOptions }
    : { ...options }

  const plugins = [
    (slider) => {
      let timeout: ReturnType<typeof setTimeout>
      let mouseOver = false
      function clearNextTimeout() {
        clearTimeout(timeout)
      }
      function nextTimeout() {
        clearTimeout(timeout)
        if (mouseOver) return
        timeout = setTimeout(() => {
          slider?.next()
        }, delay)
      }
      slider.on('created', () => {
        slider.container.addEventListener('mouseover', () => {
          mouseOver = true
          clearNextTimeout()
        })
        slider.container.addEventListener('mouseout', () => {
          mouseOver = false
          nextTimeout()
        })
        nextTimeout()
      })
      slider.on('dragStarted', clearNextTimeout)
      slider.on('animationEnded', nextTimeout)
      slider.on('updated', nextTimeout)
    },
  ]

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    optionsKeenSlider,
    HAS_ACTIONS && plugins,
  )

  useEffect(() => {
    instanceRef?.current?.update()
  }, [instanceRef, options])

  return (
    <div className="relative">
      <div ref={sliderRef} className="keen-slider">
        {children}
      </div>
      {hasArrows && <ArrowCarousel instanceRef={instanceRef} loaded={loaded} />}
      {hasDots && (
        <DotsCarousel
          instanceRef={instanceRef}
          loaded={loaded}
          currentSlide={currentSlide}
        />
      )}
    </div>
  )
}
