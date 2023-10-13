import SignUp from '@/components/modals/SignUp'
import React, { useEffect } from 'react'
import { kastelov } from '../../utils/fontFamily'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/router'

type Props = {}

export default function Register({}: Props) {
  const { isLogged } = useAuth()

  const router = useRouter()

  useEffect(() => {
    const intendedUrl = router.query.intendedUrl
      ? String(router.query.intendedUrl)
      : null
    if (isLogged) {
      setTimeout(() => {
        window.location.href = intendedUrl ?? '/'
      }, 1000)
    }
  }, [router.query, isLogged])

  return (
    <main
      className={`${kastelov.variable} h-full bg-background px-2 py-4 font-sans`}
    >
      <SignUp />
    </main>
  )
}

export async function getStaticProps() {
  return {
    props: {
      //   noApp: true,
    },
  }
}

Register.getLayout = (page) => {
  return page
}
