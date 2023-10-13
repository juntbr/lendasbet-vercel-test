import DesktopLinks from './DesktopLinks'
import Logo from './Logo'
import MobileLinks from './MobileLinks'
import SportCassinoDesktop from './SportCassinoDesktop'

export default function Header() {
  return (
    <header className="sticky top-0 left-0 right-0 z-30 font-sans border-b shadow lg:borde-none border-borderColor bg-background lg:z-50">
      <div className="flex items-center justify-between w-full p-4 py-3 lg:py-4">
        <Logo />
        <MobileLinks />
        <SportCassinoDesktop />
        <DesktopLinks />
      </div>
    </header>
  )
}
