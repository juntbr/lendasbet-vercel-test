import React, { useEffect, useState } from 'react'
import { policies } from '../../types/policies'
import { useTranslation } from 'next-i18next'

export default function ResponsibleGambling() {
  const { i18n } = useTranslation(['common'])
  const [html, setHtml] = useState(null)

  const language = i18n.language

  async function fetchPolicy() {
    const getUrl = window.location
    const baseUrl = getUrl.protocol + '//' + getUrl.host
    const policy = policies.ResponsibleGambling

    const response = await fetch(
      `${baseUrl}/api/policies/${policy}?locale=${language}`,
    )

    const data = await response.json()

    setHtml(data.htmlData)
  }

  useEffect(() => {
    fetchPolicy()
  }, [])

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
