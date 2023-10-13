import { HAS_BONUS } from '../../constants'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export function useGetCouponFromParam() {
  const { query } = useRouter()

  useEffect(() => {
    const coupon = query[HAS_BONUS]

    if (coupon && coupon !== '') {
      Cookies.set(HAS_BONUS, String(coupon))
    }
  }, [query])
}
