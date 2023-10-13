import axios from 'axios'
import { getGamMatrixUri } from './endpoints'

interface IsActiveUserSessionResponse {
  errorData: {
    errorCode: number
    errorDetails: string[]
    errorMessage: string
    logId: number
  }
  firstName: string | null
  isActive: number
  language: string | null
  lastName: string | null
  success: number
  timestamp: string
  userId: number
  userIp: string | null
  userName: string | null
  version: string
}

export async function IsActiveUserSession(sessionId: string) {
  try {
    const GAUri = getGamMatrixUri('IsActiveUserSession')

    const response = await axios.get<IsActiveUserSessionResponse>(
      `${GAUri}/${sessionId}`,
    )

    return response.data
  } catch (error) {
    return {
      isActive: false,
      userId: null,
    }
  }
}
