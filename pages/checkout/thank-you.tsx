import SuccessOrError from '@/components/Payments/SuccessOrError'
import { useAffiliatePixel } from '@/hooks/useAffiliatePixel'
import { useBalance } from '@/hooks/useBalance'
import useEventTracker from '@/hooks/useEventTracker'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

export default function ThankYou() {
  const { walletMutate, accountWalletMutate } = useBalance()
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('success')
  const { appendParamByEventName } = useEventTracker()
  const { dispatchAffiliateEvent } = useAffiliatePixel()
  const { query } = useRouter()

  const paymentFlow = query?.payment_flow
  const motive = query?.motive

  useEffect(() => {
    const status = String(query?.status)
    setStatus(status)

    if (paymentFlow === 'deposit') {
      if (status === 'notok' || status === 'error') {
        if (motive === 'declined_by_customer') {
          setMessage('Depósito cancelado. Lamentamos o inconveniente.')
        } else {
          setMessage(
            'Ocorreu um erro ao realizar o depósito, tente novamente mais tarde.',
          )
        }
      }
      if (status === 'success') {
        setMessage('Depósito confirmado!')
      }
    }

    if (paymentFlow === 'withdraw') {
      if (status === 'notok' || status === 'error') {
        if (motive === 'declined_by_customer') {
          setMessage('Saque cancelado. Lamentamos o inconveniente.')
        } else {
          setMessage(
            'Ocorreu um erro ao realizar o saque, tente novamente mais tarde.',
          )
        }
      }
      if (status === 'success') {
        setMessage('Saque realizado com sucesso!')
      }
    }
    accountWalletMutate()
    walletMutate()
  }, [])

  useEffect(() => {
    const EVENT_NAME = 'deposit-confirmation'
    appendParamByEventName(EVENT_NAME, true)
    dispatchAffiliateEvent({ type: 'deposit' })
  }, [])

  return (
    <div className="h-[85vh]">
      <SuccessOrError
        status={status}
        successStatus={'success'}
        message={message}
        type={paymentFlow}
      />
    </div>
  )
}

export async function getServerSideProps(context) {
  if (!context.query.unlock) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
      props: {},
    }
  }
  return {
    props: {
      // props for your component
    },
  }
}
