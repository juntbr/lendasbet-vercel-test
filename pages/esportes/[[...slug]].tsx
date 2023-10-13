import IframeLayout from '../../layouts/iframe'
import SportsBookIframe from '../../components/SportsBookIframe'
import { useRouter } from 'next/router'
import LoadingEllipses from '@/components/Loadings/LoadingEllipses'
import { useContext, useEffect } from 'react'
import { AppContext } from 'contexts/context'

export default function Slugs() {
  const router = useRouter()
  const { setCurrentSidebar } = useContext(AppContext)
  const slug = (router.query.slug as string[]) || []

  const queryCondition =
    router.asPath.includes('esportes') && Object.keys(router.query).length === 0

  const showLoading =
    slug.length === 0 &&
    router.asPath !== '/esportes' &&
    router.asPath !== '/esportes/' &&
    queryCondition

  useEffect(() => {
    setCurrentSidebar('Sport')
  }, [])

  if (showLoading) {
    return (
      <div className="relative flex flex-col">
        <LoadingEllipses />
      </div>
    )
  }

  return <SportsBookIframe slug={slug} />
}

Slugs.getLayout = function getLayout(page) {
  return <IframeLayout>{page}</IframeLayout>
}
