import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

import ErrorPage from '@/components/ErrorPage'
import { doToast } from 'utils/toastOptions'
import { useSession } from '../../../hooks/useSession'

const Active: React.FC = () => {
  const router = useRouter()
  const { session, setIsEmailVerified, isEmailVerified } = useSession()
  const { code, key } = router.query
  const [error, setError] = useState(false)

  const verificationCode = code?.length > 0 ? code[0] : key

  useEffect(() => {
    const getActiveAccount = async () => {
      try {
        const response = await session.call('/user/account#activate', {
          verificationCode,
        })

        if (response.desc) return setError(true)

        doToast('A sua conta foi ativada!')
        setIsEmailVerified(true)
        isEmailVerified && router.push('/cassino')
      } catch (e) {
        setError(true)
      }
    }

    getActiveAccount()
  }, [isEmailVerified, router, session, setIsEmailVerified, verificationCode])

  if (error || !verificationCode) return <ErrorPage />

  return null
}

export default Active
