import { GatewayType } from 'types/GatewayService'
import { string, object, mixed } from 'yup'

import { PixType as PixTypeCaship } from 'types/caship'
import { PixType as PixTypePay4Fun } from 'services/Pay4Fun/types'

enum EVPPixType {
  EVP = 'EVP',
}

export const withdrawSchema = object({
  gatewayType: mixed<GatewayType>()
    .oneOf(Object.values(GatewayType))
    .default(GatewayType.CASHIP)
    .required(),
  amount: string().required(),
  pixtype: mixed().when('gatewayType', ([value]) => {
    if (value === GatewayType.PAY4FUN) {
      return mixed<PixTypePay4Fun|EVPPixType>()
        .oneOf([...Object.values(PixTypePay4Fun), EVPPixType.EVP])
        .required()
    }

    return mixed<PixTypeCaship>().oneOf(Object.values(PixTypeCaship)).required()
  }),
  pixkey: string().required(),
  sessionId: string().required(),
})
