import { useRef, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import useWindowSize from '@/hooks/UseWindowSize'
const ReactPlayer = dynamic(() => import('react-player/lazy'))

export default function AutoPlaySilentVideo({ src }) {
  const [shouldPlay, setShouldPlay] = useState(false)
  const ref = useRef(null)

  const { isMobile } = useWindowSize()

  useEffect(() => {
    const refElement = ref.current

    if (!refElement || !(refElement instanceof Element)) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldPlay(true)
          observer?.unobserve(refElement)
        }
      },
      { threshold: 0.5 },
    )

    observer?.observe(refElement)

    return () => {
      observer?.unobserve(refElement)
    }
  }, [])

  return (
    <div
      ref={ref}
      className="relative object-fill w-full h-40 transition-all duration-300 ease-in-out bg-cover hover:scale-110 sm:h-full"
    >
      <ReactPlayer
        playing={shouldPlay}
        fallback={<div className="w-full h-full animate-pulse bg-secondary" />}
        url={src}
        width="100%"
        height={isMobile ? 160 : 250}
        className="relative object-fill w-full h-40 bg-cover react-player sm:h-full"
        playsinline
        autoPlay
        muted
        loop
      />
    </div>
  )
}
