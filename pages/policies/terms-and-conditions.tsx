import React, { useEffect, useState } from 'react'
import { policies } from '../../types/policies'
import LoadingEllipses from '@/components/Loadings/LoadingEllipses'
import { useTranslation } from 'next-i18next'

export default function TermsAndConditions() {
  const { i18n } = useTranslation(['common'])
  const [html, setHtml] = useState(null)

  const language = i18n.language
  // loading
  const [loading, setLoading] = useState(true)

  async function fetchPolicy() {
    setLoading(true)
    const getUrl = window.location
    const baseUrl = getUrl.protocol + '//' + getUrl.host
    const policy = policies.TermsAndConditions

    const response = await fetch(
      `${baseUrl}/api/policies/${policy}?locale=${language}`,
    )

    const data = await response.json()

    setHtml(data.htmlData)
    setLoading(false)
  }

  useEffect(() => {
    fetchPolicy()
  }, [])

  if (loading) {
    return <LoadingEllipses />
  }

  return (
    <div className="top-0 flex flex-col w-full p-3 mx-auto space-y-3 overflow-hidden max-w-7xl">
      <div
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      />
    </div>
  )
}
