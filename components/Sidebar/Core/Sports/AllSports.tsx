import { useTranslation } from 'next-i18next'
import { SessionResponse, useCall } from '@/hooks/useSession'
import { Sport } from 'types/sports'
import SportItem from './SportItem'
import LoadingSkeletonSidebar from '@/components/Loadings/LoadingSkeletonSidebar'

export default function AllSports() {
  const { i18n } = useTranslation()

  const responseAllSports = useCall<SessionResponse<Sport>>('/sports#sports', {
    lang: i18n.language ?? 'pt',
  })

  const loading = responseAllSports.isLoading

  const CONTENT_IS_READY =
    !loading && responseAllSports.data?.records?.length > 0

  if (loading) {
    return <LoadingSkeletonSidebar />
  }

  return (
    <div className="w-full">
      {CONTENT_IS_READY && (
        <div className="flex flex-col items-start justify-center px-1 space-y-4">
          {responseAllSports.data.records.map((item) => (
            <SportItem key={item.id} data={item} />
          ))}
        </div>
      )}
    </div>
  )
}
