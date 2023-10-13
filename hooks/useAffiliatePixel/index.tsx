import { MAJOR_AFFILIATES } from '../../constants'
import { useContext } from 'react'
import { PixelContext } from './PixelProvider'
import { useBtag } from '../useBtag'

export function useAffiliatePixel() {
  const { getBtagFromCookie } = useBtag()

  const btag = getBtagFromCookie()

  const affiliateId = btag ? btag.split('_')[0] : undefined

  const findAffiliate = MAJOR_AFFILIATES[affiliateId]
  const scriptUrl = findAffiliate ? findAffiliate.scriptUrl : undefined

  const { affiliateEventState, dispatchAffiliateEvent } =
    useContext(PixelContext)

  return {
    btag,
    affiliateId,
    affiliate: findAffiliate,
    src: scriptUrl,
    dispatchAffiliateEvent,
    affiliateEventState,
  }
}
