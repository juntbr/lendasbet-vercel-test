import SignIn from '@/components/modals/Login'
import React, { useEffect } from 'react'
import { kastelov } from '../../utils/fontFamily'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/router'

type Props = {}

export default function Login({}: Props) {
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
      <SignIn />
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

Login.getLayout = (page) => {
  return page
}
