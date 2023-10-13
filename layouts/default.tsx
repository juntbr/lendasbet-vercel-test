import { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import MobileSidebar from '@/components/Sidebar/Mobile'
import { AppContext } from '../contexts/context'
import { kastelov } from '../utils/fontFamily'
import { useModal } from '@/hooks/useModal'

export default function DefaultLayout({ children }) {
  const { logged } = useContext(AppContext)
  const { handleOpenModalSignup } = useModal()

  const router = useRouter()

  const isReferFriend = router.asPath.includes('?r=')

  useEffect(() => {
    if (isReferFriend && !logged) {
      handleOpenModalSignup()
    }
  }, [])

  return (
    <main
      className={`${kastelov.variable} bg-background relative h-full font-sans`}
    >
      <Header />

      {children}
      <MobileSidebar />

      <Footer />
    </main>
  )
}
