import axios, { AxiosError } from 'axios'

const PlayerApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_PLAYER_API_URL,
})

export default PlayerApi

export function isAxiosError<ResponseType>(
  error: unknown,
): error is AxiosError<ResponseType> {
  return axios.isAxiosError(error)
}

export async function playerApiFetch<T = any>(url: string) {
  const response = await PlayerApi.get<T>(url)

  return response?.data
}

export async function getPlayerProfile(
  userId: any,
  sessionId: any = null,
): Promise<{ profile: any; sessionId: any; userId: any } | null> {
  if (sessionId) {
    axios.defaults.headers.common['X-SessionId'] = sessionId
    PlayerApi.defaults.headers.common['X-SessionId'] = sessionId
  }
  try {
    const res = await playerApiFetch(`${userId}/profile`)
    const data = res.data

    return {
      profile: data,
      sessionId: axios.defaults.headers.common['X-SessionId'],
      userId,
    }
  } catch (error) {
    if (error.response) {
      console.log(error.response.data)
      console.log(error.response.status)
      console.log(error.response.headers)
      // return {
      //   error: true,
      //   data: error.response.data,
      //   status: error.response.status,
      // };
    } else if (error.request) {
      console.log(error.request)
      // return { error: true, data: error.request, status: 500 };
    } else {
      console.log('Error', error.message)
      // return { error: true, data: error.message, status: 500 };
    }
    return null
  }
}
