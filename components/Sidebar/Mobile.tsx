import { useContext, useEffect } from 'react'
import { AppContext } from 'contexts/context'
import useWindowSize from '@/hooks/UseWindowSize'
import Logo from '@/components/Sidebar/Core/Logo'
import Core from './Core'

export default function MobileSidebar() {
  const { openSideBar } = useContext(AppContext)

  const { width } = useWindowSize()

  useEffect(() => {
    document.body.style.overflow = openSideBar ? 'hidden' : ''
  }, [openSideBar])

  if (width > 1024) return null

  return (
    <div
      id="drawer-disabled-backdrop"
      className={`fixed left-0 top-0 z-40  h-screen overflow-y-auto py-4 pb-0 transition-transform lg:p-4 ${
        openSideBar ? 'transform-none' : '-translate-x-full'
      } w-full bg-background`}
      tabIndex={-1}
      aria-labelledby="drawer-disabled-backdrop-label"
      role={openSideBar ? 'dialog' : null}
    >
      <Logo />
      <Core />
    </div>
  )
}
