import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import MobileSidebar from '@/components/Sidebar/Mobile'
import { useSession } from '@/hooks/useSession'
import MobileBetSlip from '../components/MobileBetSlip'
import { kastelov } from '../utils/fontFamily'
import { useModal } from '@/hooks/useModal'

export default function HomeLayout({ children }) {
  const { logged } = useSession()
  const { handleOpenModalSignup } = useModal()
  const { asPath } = useRouter()
  const isReferFriend = asPath.includes('?r=')

  useEffect(() => {
    if (!logged && isReferFriend) {
      handleOpenModalSignup()
    }
  }, [asPath, logged])

  return (
    <div
      className={`${kastelov.variable} bg-background relative h-full font-sans`}
    >
      <Header />

      {children}
      <MobileBetSlip />
      <MobileSidebar />

      <Footer />
    </div>
  )
}
