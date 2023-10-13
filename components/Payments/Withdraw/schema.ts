import * as Yup from 'yup'
import { AnyObject, Maybe, Message } from 'yup/lib/types'

import { formatPixKey } from 'utils/validate'
import { GatewayType } from 'types/GatewayService'

declare module 'yup' {
  interface StringSchema<
    TType extends Maybe<string> = string | undefined,
    TContext extends AnyObject = AnyObject,
    TOut extends TType = TType,
  > extends Yup.BaseSchema<TType, TContext, TOut> {
    formatPixKey(
      Reference,
      message?: Message<{
        values: any
      }>,
    ): StringSchema<TType, TContext>
  }
}

function pixKeyNotValid(ref, msg) {
  return this.test({
    name: 'formatPixKey',
    exclusive: false,
    message: msg || 'Chave pix inválida',
    params: {
      reference: ref.path,
    },
    test: function (value) {
      const pixtype = this.resolve(ref)
      const result = formatPixKey(value, pixtype)
      const test = result[0]
      return test
    },
  })
}

Yup.addMethod(Yup.string, 'formatPixKey', pixKeyNotValid)

export const schema = Yup.object().shape({
  withdrawAmount: Yup.mixed().when('gatewayType', ([value]) => {
    if (value === GatewayType.PAY4FUN) {
      return Yup.number()
        .typeError('')
        .min(20, 'Insira um valor com no mínimo R$ 20,00 para prosseguir.')
        .transform((value) => (isNaN(value) ? undefined : value))
        .required('Insira um valor com no mínimo R$ 20,00 para prosseguir.')
    }
    return Yup.number()
      .typeError('')
      .min(2, 'Insira um valor com no mínimo R$ 2,00 para prosseguir.')
      .transform((value) => (isNaN(value) ? undefined : value))
      .required('Insira um valor com no mínimo R$ 2,00 para prosseguir.')
  }),
  withdrawKey: Yup.string()
    .formatPixKey(Yup.ref('withdrawPixType'))
    .required('Informe a chave para prosseguir.'),
  withdrawPixType: Yup.string().required(
    'Informe o tipo de chave para prosseguir.',
  ),
  gatewayType: Yup.mixed<GatewayType>()
    .oneOf(Object.values(GatewayType))
    .required(),
})
