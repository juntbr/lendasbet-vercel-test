import useWindowSize from '@/hooks/UseWindowSize'
import { useAuth } from '@/hooks/useAuth'
import Image from 'next/image'
import { useRouter } from 'next/router'

export default function Logo() {
  const { push } = useRouter()
  const { isLogged } = useAuth()
  const { isMobile } = useWindowSize()

  const LOGO = isMobile && isLogged ? '/images/B.svg' : '/images/logo.svg'
  const WIDTH = isMobile && isLogged ? 26 : 128
  const HEIGHT = isMobile && isLogged ? 31 : 32

  return (
    <div
      aria-label="ir para página principal"
      role="link"
      onClick={() => push('/cassino')}
      className="flex"
    >
      <Image
        src={LOGO}
        alt="Logo"
        width={WIDTH}
        height={HEIGHT}
        data-logged={isLogged}
        className="h-auto w-32 cursor-pointer data-[logged=true]:w-7 lg:w-56  data-[logged=true]:lg:w-56"
      />
    </div>
  )
}
