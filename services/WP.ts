import axios, { AxiosError } from 'axios'

const WP = axios.create({
  baseURL: process.env.WP_API_URL,
  headers: {
    Authorization: `Basic ${process.env.WP_API_BASIC_AUTH}`,
  },
})

export default WP

export function isAxiosError<ResponseType>(
  error: unknown,
): error is AxiosError<ResponseType> {
  return axios.isAxiosError(error)
}

export async function serverApiFetch<T = any>(url: string) {
  try {
    const response = await WP.get<T>(url)

    return response.data
  } catch (error) {
    throw error
  }
}
