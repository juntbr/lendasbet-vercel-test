import axios from 'axios'
import * as Sentry from '@sentry/node'
import ip from 'ip'

export async function GetUserIp(req = null): Promise<{ ip: string }> {
  if (req) {
    const ipObj = { ip: ip.address() }

    if (ipObj.ip !== null && ipObj.ip !== undefined && ipObj.ip !== '') {
      return ipObj
    }
  }

  try {
    const response = await axios.get<T>('https://api.ipify.org/?format=json')
    return response.data
  } catch (e) {
    Sentry.captureException(e)
    return { ip: '' }
  }
}

export default GetUserIp
