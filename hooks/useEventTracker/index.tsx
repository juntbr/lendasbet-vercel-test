import { useRouter } from 'next/router'
import { useBtag } from '../useBtag'

type TrackerParams = {
  [key: string]: string | number
}

const TRACKER_PARAMS_BY_EVENT = (btagValue): Record<string, TrackerParams> => ({
  cassino: {
    btag: btagValue,
  },
  'signup-initiated': {
    event: 'initiate-register',
    btag: btagValue,
  },
  'signup-finished': {
    event: 'confirm',
    btag: btagValue,
  },
  'email-confirm': {
    event: 'confirm',
    btag: btagValue,
  },
  'pix-generated': {
    event: 'pix-generated',
    btag: btagValue,
  },
  'deposit-confirmation': {
    payment_flow: 'deposit',
    payment_method: 'pix',
    status: 'success',
    btag: btagValue,
  },
  'open-deposit': {
    event: 'open-deposit',
    btag: btagValue,
  },
})

export default function useEventTracker() {
  const router = useRouter()
  const { getBtagFromCookie } = useBtag()
  const btagValue = getBtagFromCookie()

  /**
   * Appends tracking parameters for a given event to the current URL query string,
   * and redirects the user to the updated URL.
   *
   * @param {keyof TrackerParams} event - The name of the event to track.
   * @param {boolean} isShallow - If `true`, performs a shallow route update.
   * If `false` or not provided, performs a full page refresh.
   * @returns {void}
   */
  function appendParamByEventWthRedirect(event: keyof TrackerParams) {
    const { pathname, query } = router
    const params = TRACKER_PARAMS_BY_EVENT(btagValue)[event]
    if (!params) return
    if (params.btag === 'undefined') {
      delete params.btag
    }
    const newQuery = { ...query, ...params }
    router.push({
      pathname,
      query: newQuery,
    })
  }

  /**
   * Appends tracking parameters for a given event to the current URL query string.
   *
   * @param {string} event - The name of the event to track.
   * @param {boolean} isCleaner - If `true`, replaces the current query string with the tracking parameters.
   * If `false` or not provided, appends the tracking parameters to the current query string.
   * @returns {void}
   */
  function appendParamByEventName(event: string, isCleaner: boolean) {
    const params = TRACKER_PARAMS_BY_EVENT(btagValue)[event]
    if (!params) return

    if (params.btag === 'undefined') {
      delete params.btag
    }

    const queryStringParams = Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')
    const currentSearch = window.location.search.includes('?')
      ? window.location.search + '&'
      : '?'

    if (isCleaner) {
      return window.history.replaceState(
        null,
        null,
        `${window.location.pathname}?${queryStringParams}`,
      )
    }

    window.history.replaceState(
      null,
      null,
      `${window.location.pathname}${currentSearch}${queryStringParams}`,
    )
  }

  return {
    appendParamByEventName,
    appendParamByEventWthRedirect,
  }
}
