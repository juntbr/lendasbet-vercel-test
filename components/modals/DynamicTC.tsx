import { useEffect, useState } from 'react'
import { playerApiFetch } from 'services/PlayerApi'
import { useTranslation } from 'next-i18next'

function DynamicTC() {
  const { t } = useTranslation(['common'])
  const [tc, setTC] = useState(null)

  async function getConsent() {
    const consent = await playerApiFetch(`consentRequirements`)
    const term = consent.items.find(
      (item) => item.tagCode === 'termsandconditions',
    )
    setTC(term)
  }

  useEffect(() => {
    getConsent()
  }, [])

  return (
    <>
      {tc ? (
        <>
          <h2 className="mb-1 text-2xl font-bold text-neutral-10">
            {tc.friendlyName}
          </h2>
          <div className="w-full pt-2">
            <div className="w-full max-w-md text-white rounded-lb">
              {tc.description}
            </div>
          </div>
        </>
      ) : (
        <p className="text-white">{t('Loading')}...</p>
      )}
    </>
  )
}

export default DynamicTC
