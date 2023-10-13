import * as Yup from 'yup'
import { AnyObject, Maybe, Message } from 'yup/lib/types'

import WebApi from '@/hooks/useSession/services/webapi.service'

declare module 'yup' {
  interface StringSchema<
    TType extends Maybe<string> = string | undefined,
    TContext extends AnyObject = AnyObject,
    TOut extends TType = TType,
  > extends Yup.BaseSchema<TType, TContext, TOut> {
    notEqualTo(
      Reference,
      message?: Message<{
        values: any
      }>,
    ): StringSchema<TType, TContext>
  }
}

function notEqualTo(ref, msg) {
  return this.test({
    name: 'notEqualTo',
    exclusive: false,
    message: msg || '${path} must not be the same as ${reference}',
    params: {
      reference: ref.path,
    },
    test: function (value) {
      return value !== this.resolve(ref)
    },
  })
}

Yup.addMethod(Yup.string, 'notEqualTo', notEqualTo)

interface PasswordValidation {
  regex: RegExp | null
  message: string
}

interface UserSchemaParams {
  session: WebApi
  passwordValidation: PasswordValidation
}

export function useSchema(params: UserSchemaParams) {
  const { session, passwordValidation } = params

  const schema = Yup.object().shape({
    username: Yup.string()
      .required('O nome do usuário é obrigatório.')
      .min(4, 'O usuário é necessário ter no mínimo 4 caracteres.')
      .notEqualTo(
        Yup.ref('password'),
        'O nome de usuário não pode ser igual à senha.',
      )
      .matches(
        /^[A-Za-z0-9]*$/,
        'Não são permitidos espaços e caracteres especiais no nome de usuário.',
      )
      .test('UsernameTaken', 'Usuário já está em uso.', async function (value) {
        if (!value) {
          return false
        }
        try {
          const result = await session.call('/user/account#validateUsername', {
            username: value,
          })
          return result.isAvailable
        } catch (e) {
          return false
        }
      }),
    email: Yup.string()
      .required('O campo de e-mail é obrigatório.')
      .test('UniqueEmail', 'Email já está em uso.', async function (value) {
        if (!value) {
          return false
        }
        try {
          const result = await session.call('/user/account#validateEmail', {
            email: value,
          })
          return result.isAvailable
        } catch (e) {
          return false
        }
      }),
    phone: Yup.string().required('O campo de telefone é obrigatório'),
    password: Yup.string()
      .required('O campo de senha é obrigatório.')
      .notEqualTo(
        Yup.ref('username'),
        'Senha não pode ser igual ao nome de usuário.',
      )
      .matches(
        passwordValidation.regex,
        /* passwordValidation.message */ 'Sua senha deve conter pelo menos 8 caracteres, 1 letra e 1 número.',
      ), // TODO ajustar mensagem que retorna da api
    retryPassword: Yup.string()
      .required('A confirmação da senha é obrigatória.')
      .oneOf([Yup.ref('password')], 'As senhas não são iguais.'),
    terms: Yup.boolean()
      .required('É necessário o aceite dos termos e condições.')
      .oneOf([true], 'É necessário o aceite dos termos e condições.'),
    years: Yup.boolean()
      .required('É necessário informar se você é maior que 18 anos.')
      .oneOf([true], 'É necessário que você seja maior que 18 anos.'),
  })

  return schema
}
