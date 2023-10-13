import { useContext, useEffect, useRef, useState } from 'react'
import { AppContext } from '../contexts/context'
import { useAuth } from '../hooks/useAuth'
import LoadingEllipses from './Loadings/LoadingEllipses'
import { useRouter } from 'next/router'
import TabsToggleTypeGames from './Header/TabsToggleTypeGames'
import { activeLink } from './Header/SportCassinoDesktop'
import { useModal } from '@/hooks/useModal'
import { useTranslation } from 'next-i18next'

export default function SportsBookIframe({ slug }) {
  const { t } = useTranslation(['common'])
  const { isLogged } = useAuth()
  const [iframeSrc, setIframeSrc] = useState('')
  const iframeRef = useRef(null)
  const router = useRouter()
  const [locale, setLocale] = useState('pt')

  useEffect(() => {
    setLocale(router.locale ? router.locale : 'pt')
  }, [router.locale])

  const { handleOpenModalLogin, handleOpenModalSignup } = useModal()

  const {
    setBetSlipBettingSelectionsCount,
    setIframeRef,
    loading,
    setLoading,
    dynamicUrl,
    setDynamicUrl,
    sidebarSearchQuery,
  } = useContext(AppContext)

  useEffect(() => {
    setIframeRef(iframeRef.current)
  }, [iframeRef])

  useEffect(() => {
    if (!iframeRef) return () => {}
    if (!iframeRef?.current) return () => {}
    if (iframeRef && !loading) {
      switch (router.query.op) {
        case 'openSearchModal':
          iframeRef.current.contentWindow.postMessage(
            {
              type: 'OP:openSearchModal',
              query: sidebarSearchQuery,
            },
            '*',
          )
          break
      }
    }
  }, [iframeRef, router.query, loading])

  function addListener() {
    window.addEventListener('message', receiveMsg, false)
  }

  function removeListener() {
    window.removeEventListener('message', receiveMsg)
  }

  const sportsBookRoute = 'esportes'

  function receiveMsg(event) {
    const {
      data: { type, payload },
    } = event

    switch (type) {
      case 'OMFE:iFrameHeight': {
        if (!iframeRef.current) {
          break
        }
        if (payload > 0) {
          iframeRef.current.style.height =
            payload < 800 ? `100vh` : `${payload}px`
        }
        break
      }

      case 'OMFE:appReady': {
        setLoading(false)
        break
      }

      case 'OMFE:pageError': {
        router.push('/404')
        break
      }

      case 'OMFE:showOverlay': {
        if (!iframeRef.current) {
          break
        }

        iframeRef.current.classList.add('OverlayOpen')
        break
      }

      case 'OMFE:betslipSelectionsCount': {
        if (!iframeRef.current) {
          break
        }

        if (payload.count > 0) {
          setBetSlipBettingSelectionsCount(payload.count)
        }

        if (payload.count === 0) {
          setBetSlipBettingSelectionsCount(0)
        }
        break
      }

      case 'OMFE:sessionReady': {
        break
      }

      case 'OMFE:goToLogin': {
        if (!iframeRef.current) {
          break
        }

        handleOpenModalLogin()

        break
      }

      case 'OMFE:showBetslip':
        break
      case 'OMFE:hideBetslip':
        break

      case 'OMFE:goToRegister': {
        if (!iframeRef.current) {
          break
        }
        handleOpenModalSignup()

        break
      }

      case 'OMFE:locationChanged': {
        if (!payload.basePath) {
          break
        }

        const newUrl = `${payload.basePath}/${sportsBookRoute}/${payload.pathname}${payload.hash}${window.location.search}`
        history.replaceState(payload.state, 'Sport', newUrl)

        if (payload.hash && payload.offset) {
          window.scrollTo(
            window.scrollX,
            iframeRef.current.getBoundingClientRect().top + payload.offset,
          )
        }

        break
      }

      case 'OMFE:scrollTop':
        window.scrollTo({
          top: 0,
        })
        break

      default: {
      }
    }
  }

  useEffect(() => {
    setLoading(true)
    const frame = document.getElementById('SportsBookIframe')
    frame.addEventListener('load', addListener)
    return frame.addEventListener('onbeforeunload', removeListener)
  }, [])

  useEffect(() => {
    if (iframeRef) {
      iframeRef.current.src = iframeSrc
    }
  }, [isLogged])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return () => {}
    }

    const { origin, hash } = window.location

    const basePath = window.encodeURIComponent(`${origin}`)
    let iframeSrc = process.env.NEXT_PUBLIC_API_IFRAME + '/' + locale + '/'

    if (dynamicUrl !== '/' && dynamicUrl !== '') {
      iframeSrc += dynamicUrl
    }
    if (hash) {
      iframeSrc += hash
    }

    const approvedQueryParams = Object.keys(router.query).filter((key) => {
      if (key === 'query') return true
      return false
    })

    const test = approvedQueryParams.length > 0
    let queryPart = ''
    if (test) {
      queryPart =
        '&' +
        approvedQueryParams
          .map((key) => {
            return `${key}=${router.query[key]}`
          })
          .join('&')
    }

    const finalIframeSrc = `${iframeSrc}?basePath=${basePath}${queryPart}`
    setIframeSrc(finalIframeSrc)
  }, [dynamicUrl, locale])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return () => {}
    }

    const { origin, hash } = window.location

    const basePath = window.encodeURIComponent(`${origin}`)
    let iframeSrc = process.env.NEXT_PUBLIC_API_IFRAME + '/' + locale + '/'

    const theDynamicUrl = slug.join('/')

    setDynamicUrl(theDynamicUrl)

    if (theDynamicUrl !== '/' && theDynamicUrl !== '') {
      iframeSrc += theDynamicUrl
    }

    if (hash) {
      iframeSrc += hash
    }

    const approvedQueryParams = Object.keys(router.query).filter((key) => {
      if (key === 'query') return true
      return false
    })

    const test = approvedQueryParams.length > 0
    let queryPart = ''

    if (test) {
      queryPart =
        '&' +
        approvedQueryParams
          .map((key) => {
            return `${key}=${router.query[key]}`
          })
          .join('&')
    }

    const finalIframeSrc = `${iframeSrc}?basePath=${basePath}${queryPart}`
    setIframeSrc(finalIframeSrc)
  }, [])

  const IS_BET_HISTORY = router.asPath.includes('historico-de-apostas')

  return (
    <div className="relative flex flex-col">
      {loading ? (
        <LoadingEllipses />
      ) : (
        !IS_BET_HISTORY && (
          <div className="px-4 pt-3 lg:pt-0">
            <TabsToggleTypeGames
              link="/esportes"
              liveLink="/esportes/esportes-ao-vivo/todos-esportes/0"
              name={t('Sports')}
              iframe
            />
          </div>
        )
      )}

      <iframe
        frameBorder={0}
        src={iframeSrc}
        ref={iframeRef}
        id="SportsBookIframe"
        className="SportsIframe"
        title="Sports Iframe"
        scrolling="no"
        allow="autoplay; fullscreen"
        style={{ height: '100vh' }}
      ></iframe>
    </div>
  )
}
