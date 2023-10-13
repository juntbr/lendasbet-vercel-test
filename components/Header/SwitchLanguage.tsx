import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import languagesObj from '../../constants/languages.cjs'
import { Select } from '../Select'
import { SelectItem } from '../Select/Selectitem'
import Image from 'next/image'

export function SwitchLanguage() {
  const { locale } = useRouter()

  const NEXT_LOCALE = Cookies.get('NEXT_LOCALE')

  const { pathname, asPath, query, push } = useRouter()

  const onToggleLanguageClick = (newLocale) => {
    Cookies.set('NEXT_LOCALE', newLocale, { expires: 365 })
    push({ pathname, query }, asPath, { locale: newLocale })
  }

  return (
    <Select
      defaultValue={NEXT_LOCALE || locale}
      onValueChange={onToggleLanguageClick}
    >
      {Object.values(languagesObj.languages).map((language) => (
        <SelectItem key={language.key} value={language.key}>
          <Image
            src={language.flag}
            alt="flag"
            width={28}
            height={28}
            className="rounded"
          />
        </SelectItem>
      ))}
    </Select>
  )
}
