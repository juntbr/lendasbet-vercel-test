import { useGoogleTagManager } from '@/hooks/useGoogleTagManager'
import { AppContext } from 'contexts/context'
import { useContext } from 'react'

export function useDataLayer() {
  const { account, roles } = useContext(AppContext)
  const { setDataLayer } = useGoogleTagManager()

  const sendDataLayer = (
    eventName,
    amount = null,
    gateway = null,
    cupom = null,
  ) => {
    const EVENT_NAME = eventName
    const FULL_NAME = account.firstname + ' ' + account.surname
    setDataLayer({
      event: EVENT_NAME,
      currency: 'BRL',
      method: 'PIX',
      amount,
      cupom,
      gateway,
      user: {
        id: account.userID,
        name: FULL_NAME,
        email: account.email,
        phone: account.phone,
      },
    })
  }

  return {
    roles,
    account,
    sendDataLayer,
  }
}
