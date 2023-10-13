import { AppContext } from 'contexts/context'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { useTranslation } from 'next-i18next'
import { LiveComponent } from './LiveComponent'

export const activeLink = (current: string, asPath: any) => {
  const IS_LIVE_CASINO =
    current === '/cassino/ao-vivo' &&
    (asPath.includes('type=live') || asPath.includes('cassino/ao-vivo'))

  const IS_CASSINO =
    current === '/cassino' &&
    asPath.includes('/cassino') &&
    !(asPath.includes('type=live') || asPath.includes('cassino/ao-vivo'))

  const IS_SPORTS =
    current === '/esportes' &&
    (asPath.includes('evento/') || asPath.includes('/esportes')) &&
    !asPath.includes('evento-ao-vivo/') &&
    !asPath.includes('/esportes-ao-vivo')

  const IS_LIVE_SPORTS =
    current === '/esportes/esportes-ao-vivo/' &&
    (asPath.includes('evento-ao-vivo/') || asPath.includes('/esportes-ao-vivo'))

  if (IS_CASSINO || IS_LIVE_CASINO || IS_SPORTS || IS_LIVE_SPORTS) {
    return true
  }

  return false
}

export default function SportCassinoDesktop() {
  const { setDynamicUrl } = useContext(AppContext)

  const { asPath, push } = useRouter()

  const { t } = useTranslation(['common'])

  const ACTIVE = 'absolute w-28 bottom-0 mx-auto h-0.5 bg-primary'

  const INACTIVE = 'absolute w-28 bottom-0 mx-auto h-0.5 group-hover:bg-primary'

  const SPORTS_STYLE = activeLink('/esportes', asPath) ? ACTIVE : INACTIVE

  const SPORTS_LIVE_STYLE = activeLink('/esportes/esportes-ao-vivo/', asPath)
    ? ACTIVE
    : INACTIVE

  const CASINO_STYLE = activeLink('/cassino', asPath) ? ACTIVE : INACTIVE

  const CASINO_LIVE_STYLE = activeLink('/cassino/ao-vivo', asPath)
    ? ACTIVE
    : INACTIVE

  return (
    <div className="justify-center flex-1 hidden space-x-8 lg:flex xl:space-x-14">
      <Link
        href="/esportes"
        onClick={() => setDynamicUrl('/')}
        className="text-sm font-bold leading-10 text-center text-white uppercase cursor-pointer group w-28"
      >
        {t('Sports')}
        <div className={SPORTS_STYLE}></div>
      </Link>

      <Link
        href="/esportes/esportes-ao-vivo/todos-esportes"
        onClick={() => setDynamicUrl('esportes-ao-vivo/todos-esportes')}
        className="flex flex-col items-center text-sm font-bold leading-10 text-center text-white uppercase cursor-pointer group w-28 whitespace-nowrap"
      >
        <div className="flex items-center space-x-2">
          <span>{t('Sports')}</span>
          <LiveComponent />
        </div>
        <div className={SPORTS_LIVE_STYLE}></div>
      </Link>

      <div
        onClick={() => push('/cassino')}
        className="text-sm font-bold leading-10 text-center text-white uppercase cursor-pointer group w-28"
      >
        {t('Casino')}
        <div className={CASINO_STYLE}></div>
      </div>

      <Link
        href="/cassino/ao-vivo"
        className="flex flex-col items-center text-sm font-bold leading-10 text-center text-white uppercase cursor-pointer group w-28 whitespace-nowrap"
      >
        <div className="flex items-center space-x-2">
          <span>{t('Casino')}</span>
          <LiveComponent />
        </div>
        <div className={CASINO_LIVE_STYLE}></div>
      </Link>
    </div>
  )
}
