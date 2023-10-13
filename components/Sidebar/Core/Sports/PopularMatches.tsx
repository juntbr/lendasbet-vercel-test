import React, { useContext } from 'react'
import { useTranslation } from 'next-i18next'

import { AppContext } from 'contexts/context'
import { SessionResponse, useCall } from '@/hooks/useSession'
import { Match, Tournament } from 'types/sports'
import LoadingSkeletonSidebar from '@/components/Loadings/LoadingSkeletonSidebar'
import useSidebar from '@/hooks/useSidebar'

export default function PopularMatches() {
  const { i18n } = useTranslation()

  const responsePopularMatchs = useCall<SessionResponse<Tournament | Match>>(
    '/sports#customEvents',
    {
      lang: i18n.language ?? 'pt',
      dataWithoutOdds: false,
    },
  )

  const { createUrl } = useContext(AppContext)
  const { closeMenu } = useSidebar()

  const loading = responsePopularMatchs.isLoading

  const CONTENT_IS_READY =
    !loading && responsePopularMatchs.data?.records?.length > 0

  if (loading) {
    return <LoadingSkeletonSidebar />
  }

  return (
    <div className="w-full">
      {CONTENT_IS_READY && (
        <ul className="flex flex-col items-start justify-center px-1 space-y-4">
          {responsePopularMatchs.data.records.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                createUrl(item)
                closeMenu()
              }}
              className="flex items-center w-full text-sm font-normal truncate transition-all duration-300 ease-in-out cursor-pointer whitespace-nowrap text-neutral-20 hover:text-white"
            >
              {item.shortTranslatedName ? item.shortTranslatedName : item.name}
            </button>
          ))}
        </ul>
      )}
    </div>
  )
}
