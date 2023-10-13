import useSWRInfinite from 'swr/infinite'

import fetch from 'services/fetcher'
import { shouldExcludeSubvendor } from './utils'

import { BasicCasinoResponse, SubVendor } from 'types/casino'

type Response = BasicCasinoResponse<SubVendor>

function getKey(
  pageIndex: number,
  previousPageData: Response | null,
  ITEMS_PER_PAGE: number,
) {
  if (previousPageData && !previousPageData?.pages?.next === null) return null

  return `${
    process.env.NEXT_PUBLIC_CASINO_API_URL
  }/vendors?language=pt&selectedCountryCode=BR&fields=id,name,logo&pagination=offset=${
    pageIndex * ITEMS_PER_PAGE
  },limit=${ITEMS_PER_PAGE}`
}

interface UserVendors {
  vendors: any[] | null
}

export function useVendors(ITEM_PER_PAGE = 20): UserVendors {
  const { data } = useSWRInfinite<Response>(
    (pageIndex, previousData) => getKey(pageIndex, previousData, ITEM_PER_PAGE),
    fetch,
  )

  const vendors =
    data?.flatMap((page) => page.items)?.filter(shouldExcludeSubvendor) ?? []

  return {
    vendors,
  }
}
