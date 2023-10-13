import { useContext } from 'react'
import { AppContext } from 'contexts/context'
import useWindowSize from '@/hooks/UseWindowSize'
import Core from './Core'

export default function DesktopSidebar() {
  const { openSideBar } = useContext(AppContext)

  const { isMobile } = useWindowSize()

  if (isMobile) return null

  return (
    <div
      id="drawer-disabled-backdrop"
      className={`scrollbar-thumb-borderColor fixed left-0 top-0 z-40 h-screen overflow-y-auto pt-[75px] transition-transform scrollbar-thin scrollbar-track-background  ${
        openSideBar ? 'transform-none' : '-translate-x-0'
      } border-borderColor w-64 border-r bg-background`}
      tabIndex={-1}
      aria-labelledby="drawer-disabled-backdrop-label"
      role={openSideBar ? 'dialog' : null}
    >
      <Core />
    </div>
  )
}
