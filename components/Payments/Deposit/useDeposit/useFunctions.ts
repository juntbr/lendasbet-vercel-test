import axios from 'axios'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'
import { v4 as uuid } from 'uuid'
import { useOptix } from '@/hooks/useOptix'
import { useAuth } from '@/hooks/useAuth'

export default function useFunctions() {
  const router = useRouter()
  const { userId, sessionId } = useAuth()
  const { tracker } = useOptix()

  const getPaymentStatus = async (partner_order_number, gateway) => {
    const checkTransactionRes = await axios.get(
      `/api/payments/status?id=${partner_order_number}&gatewayType=${gateway}`,
    )
    const checkTransactionData = await checkTransactionRes.data
    return checkTransactionData
  }

  async function validateBonusCode(bonusCode) {
    const res = await fetch(
      `/api/bonus/validate?bonusCode=${bonusCode}&sessionId=${sessionId}`,
    )
    return await res.json()
  }

  function trackerDeposit(depositAmount) {
    tracker('DEPOSIT', {
      event_type: 'banking',
      event_uuid: uuid(),
      event_datetime: dayjs().format(),
      event_value: depositAmount,
      event_info_1: 'BRL',
      event_info_2: 'PIX',
      event_info_3: 'pending',
      userid: userId,
    })
  }

  function redirectToThankYouPage(btag) {
    router.push(
      {
        pathname: '/checkout/thank-you',
        query: {
          payment_flow: 'deposit',
          payment_method: 'pix',
          status: 'success',
          unlock: true,
          btag: btag || '',
        },
      },
      `/checkout/thank-you?payment_flow=deposit&payment_method=pix&status=success${
        btag ? '&btag=' + btag : ''
      }`,
    )
  }

  return {
    getPaymentStatus,
    validateBonusCode,
    trackerDeposit,
    redirectToThankYouPage,
  }
}
