import axios from 'axios'
import useSWR, { SWRConfiguration } from 'swr'
interface Options {
  params?: any
  swrConfiguration?: SWRConfiguration
}

export async function fetcher<T = any>(url: string, params?: any): Promise<T> {
  const response = await axios.get<T>(url, params)

  return response.data
}

export function useFetch<T = any>(url: string, options?: Options) {
  const { data, error, mutate, isValidating } = useSWR<T>(
    url,
    (url) => fetcher(url, options?.params),
    options?.swrConfiguration,
  )

  return {
    data,
    isLoading: !error && !data,
    error,
    mutate,
    isValidating,
  }
}
