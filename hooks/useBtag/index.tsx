import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import Cookies from 'js-cookie'
import { AFFILIATE_CODE } from '../../constants'
import { useRouter } from 'next/router'

export type BtagContextType = {
  btag: string
  setBtag: (url: string) => void
  getBtagFromCookie: () => string
}

const defaultContext: BtagContextType = {
  btag: '',
  setBtag: (url: string) => {},
  getBtagFromCookie: () => '',
}

const BtagContext = createContext(defaultContext)

export const BtagProvider = ({ children }: PropsWithChildren) => {
  const { replace, query } = useRouter()
  const [btag, setBtag] = useState('')

  function treatBtag(btag: string) {
    return btag?.includes('-')
      ? btag?.includes('=')
        ? btag?.split('-')[0]
        : btag
      : btag
  }

  const getBtagFromParamAndSaveOnCookie = useCallback(() => {
    if (btag && btag !== '') {
      const btagWithoutExtraParams = treatBtag(btag)
      Cookies.set(AFFILIATE_CODE, btagWithoutExtraParams, { expires: 30 })
    }
  }, [btag])

  const getBtagWithExtraParams = useCallback(() => {
    if (btag?.includes('-')) {
      const btagUrl = window.location.href.split('btag=')
      let finalUrl = ''

      if (btagUrl[1].includes('&')) {
        finalUrl = '&' + btagUrl[1].split('&')[1]
      }

      let btagParam = btag
      let urlWithAllParams = btagUrl[0] + 'btag=' + btagParam + finalUrl

      if (btag.split('-')[1].includes('=')) {
        btagParam = btag.split('-')[0]
        const paramsWithoutBtag = btag.split('-')[1].replace(',', '&')
        urlWithAllParams =
          btagUrl[0] + 'btag=' + btagParam + '&' + paramsWithoutBtag + finalUrl
      }

      replace(urlWithAllParams)
    }
  }, [btag, replace])

  const getBtagFromCookie = () => {
    const btagFromCookie = Cookies.get(AFFILIATE_CODE)
    setBtag(btagFromCookie)
    return btagFromCookie
  }

  useEffect(() => {
    const btag = query[AFFILIATE_CODE]?.toString()
    setBtag(btag)
  }, [query])

  useEffect(() => {
    if (btag) {
      getBtagFromParamAndSaveOnCookie()
      getBtagWithExtraParams()
    }
  }, [btag])

  return (
    <BtagContext.Provider
      value={{
        btag,
        setBtag,
        getBtagFromCookie,
      }}
    >
      {children}
    </BtagContext.Provider>
  )
}

export function useBtag() {
  const context = useContext(BtagContext)

  return context
}
