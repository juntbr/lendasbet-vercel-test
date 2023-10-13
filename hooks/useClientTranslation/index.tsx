import { useTranslation } from 'next-i18next'
import { useCallback, useEffect } from 'react'
export default function useClientTranslation(
  namespace: Array<string> | string = [],
  obj?: object,
) {
  const { i18n } = useTranslation(namespace, {
    bindI18n: 'languageChanged loaded',
    ...obj,
  })

  const t = useCallback(
    (text: string, obj?: object) => i18n?.isInitialized && i18n?.t(text, obj),
    [i18n],
  )

  useEffect(() => {
    if (i18n) {
      i18n?.reloadResources(i18n.resolvedLanguage, namespace)
    }
  }, [i18n])

  return { t, isReady: i18n.isInitialized, i18n }
}
