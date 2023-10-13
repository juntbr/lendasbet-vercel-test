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
  }/subVendors?language=pt&selectedCountryCode=BR&fields=id,name,logo&pagination=offset=${
    pageIndex * ITEMS_PER_PAGE
  },limit=${ITEMS_PER_PAGE}`
}

interface UserSubVendors {
  isValidating: boolean
  isLoadingInitial: boolean
  subvendors: SubVendor[] | null
  size: number
  setSize: (value: number) => void
  hasMorePages: boolean
}

export function useSubVendors(ITEM_PER_PAGE = 20): UserSubVendors {
  const { data, size, setSize, isValidating, error } = useSWRInfinite<Response>(
    (pageIndex, previousData) => getKey(pageIndex, previousData, ITEM_PER_PAGE),
    fetch,
  )

  const isLoadingInitial = !data && !error

  const subvendors =
    data?.flatMap((page) => page.items)?.filter(shouldExcludeSubvendor) ?? []

  const hasMorePages = data?.length > 0 && data[size - 1]?.pages?.next !== null

  return {
    isValidating,
    isLoadingInitial,
    subvendors,
    size,
    setSize,
    hasMorePages,
  }
}
