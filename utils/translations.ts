import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export const loadTranslation = (
  locale: string,
  namespaces?: string[],
  config?: any,
  extra?,
) => {
  // console.log({ msg: 'loadTranslation', locale, namespaces, config, extra })
  return serverSideTranslations(locale!, namespaces!, config!, extra!)
}
