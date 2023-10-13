import { AppContext } from 'contexts/context'
import Link from 'next/link'
import { useContext } from 'react'
import { useRouter } from 'next/router'
import { LiveComponent } from './LiveComponent'
import { Button } from 'design-system/button'

export default function TabsToggleTypeGames({
  link,
  liveLink,
  name,
  iframe = false,
}) {
  const { setDynamicUrl } = useContext(AppContext)
  const { asPath } = useRouter()

  const isLive = asPath.includes('ao-vivo')

  function navigateIframe(url) {
    if (iframe) setDynamicUrl(url)
  }

  return (
    <div className="flex items-start justify-center w-full pb-4 lg:hidden">
      <Link
        href={link}
        onClick={() => navigateIframe(link.replace('/esportes', '/'))}
        className="w-full"
      >
        <Button
          variant={isLive ? 'secondary' : 'primary'}
          className="w-full border-r-0 rounded-r-none border-borderColor"
        >
          {name}
        </Button>
      </Link>

      <Link
        href={liveLink}
        onClick={() => navigateIframe(liveLink.replace('/esportes/', ''))}
        className="w-full"
      >
        <Button
          variant={isLive ? 'primary' : 'secondary'}
          data-isLive={isLive}
          className="border-borderColor w-full rounded-l-none border-l-0 text-[#ADAFAF] data-[isLive=true]:text-secondary"
          endIcon={<LiveComponent />}
        >
          {name}
        </Button>
      </Link>
    </div>
  )
}
