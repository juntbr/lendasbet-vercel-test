import { useRouter } from 'next/router'
import { useEffect } from 'react'

export function usePixelFacebook() {
  const { events } = useRouter()

  const PIXEL_FB = '1237140483651827'

  useEffect(() => {
    import('react-facebook-pixel')
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.init(PIXEL_FB)
        ReactPixel.pageView()

        events.on('routeChangeComplete', () => {
          ReactPixel.pageView()
        })
      })
  }, [events])
}
