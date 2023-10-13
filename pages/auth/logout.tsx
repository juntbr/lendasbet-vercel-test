import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/router'

type Props = {}

export default function Logout({}: Props) {
  const { isLogged, handleLogout } = useAuth()

  const router = useRouter()

  useEffect(() => {
    const intendedUrl = router.query.intendedUrl
      ? String(router.query.intendedUrl)
      : null
    if (isLogged) {
      handleLogout().then(() => {
        setTimeout(() => {
          window.location.href = intendedUrl ?? '/'
        }, 1000)
      })
    }
  }, [router.query, isLogged])

  return null
}

export async function getStaticProps() {
  return {
    props: {
      //   noApp: true,
    },
  }
}

Logout.getLayout = (page) => {
  return page
}
