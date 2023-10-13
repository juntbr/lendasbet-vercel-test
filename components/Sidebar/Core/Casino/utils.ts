import { SubVendor } from 'types/casino'

import providersJson from './providers-blacklist.json'

export const CASINO_SUBVENDORS_TO_EXCLUDE = providersJson

export function shouldExcludeSubvendor(subVendor: SubVendor) {
  return (
    CASINO_SUBVENDORS_TO_EXCLUDE.includes(
      subVendor.name.toLocaleLowerCase(),
    ) === false
  )
}
