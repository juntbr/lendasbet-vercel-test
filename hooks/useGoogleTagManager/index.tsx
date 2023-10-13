import { PropsWithChildren, createContext, useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import TagManager from 'react-gtm-module'
import useWindowSize from '../UseWindowSize'
import { useBtag } from '../useBtag'
import dayjs from 'dayjs'

type DataLayerType = {
  event?: string
  page?: string
  [key: string]: any
}

type GoogleTagManagerContextType = {
  setDataLayer: (data: DataLayerType) => void
}

const GoogleTagManagerContext = createContext<GoogleTagManagerContextType>(null)

export const GoogleTagManagerProvider = ({ children }: PropsWithChildren) => {
  const { events } = useRouter()
  const { width } = useWindowSize()
  const { btag } = useBtag()

  function getCurrentPage() {
    if (typeof window === 'undefined') {
      return ''
    }
    const { href, search } = window.location
    return search ? href.replace(search, '') : href
  }

  function setDataLayer(data: DataLayerType, dataLayerName = undefined): void {
    TagManager.dataLayer({
      dataLayer: {
        page: getCurrentPage(),
        channel: width < 1024 ? 'mobile' : 'desktop',
        event_datetime: dayjs().format(),
        btag,
        ...data,
      },
      dataLayerName,
    })
  }

  useEffect(() => {
    const gtmId = 'GTM-56MSXPS'
    TagManager.initialize({ gtmId })
  }, [])

  useEffect(() => {
    const handleRouteChange = () => {
      const currentpage = getCurrentPage()

      TagManager.dataLayer({
        dataLayer: {
          event: 'pageview',
          page: currentpage,
        },
      })
    }

    events.on('routeChangeComplete', handleRouteChange)

    return () => {
      events.off('routeChangeComplete', handleRouteChange)
    }
  }, [events])

  return (
    <GoogleTagManagerContext.Provider value={{ setDataLayer }}>
      {children}
    </GoogleTagManagerContext.Provider>
  )
}

export function useGoogleTagManager() {
  const context = useContext(GoogleTagManagerContext)

  return context
}
