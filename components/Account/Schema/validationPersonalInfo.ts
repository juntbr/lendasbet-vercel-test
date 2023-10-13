import * as Yup from 'yup'

const specialCharacterRegex = /^[^;]*$/

export const validationPersonalInfoSchema = Yup.object().shape({
  name: Yup.string()
    .test(
      'is-full-name',
      'Informe o nome completo. Ex: Fulano Silva',
      (value) => value?.split(' ').length >= 2 && value.split(' ')[1] !== '',
    )
    .required('Nome é obrigatório.')
    .matches(specialCharacterRegex, 'Não são permitidos caracteres especiais'),
  birthDate: Yup.string()
    .required('Data de nascimento é obrigatório.')
    .matches(specialCharacterRegex, 'Não são permitidos caracteres especiais'),
  mobile: Yup.string().required('Celular é obrigatório.'),
  cpf: Yup.string()
    .required('CPF é obrigatório.')
    .min(11)
    .matches(specialCharacterRegex, 'Não são permitidos caracteres especiais'),
  postalCode: Yup.string()
    .required('CEP é obrigatório.')
    .matches(specialCharacterRegex, 'Não são permitidos caracteres especiais'),
  address1: Yup.string()
    .required('O nome da rua é obrigatório')
    .matches(specialCharacterRegex, 'Não são permitidos caracteres especiais'),
  address2: Yup.number()
    .positive()
    .typeError('Apenas números são permitidos')
    .transform((value) => (isNaN(value) ? undefined : value))
    .required('O número é obrigatório'),
  neighborhood: Yup.string()
    .nullable()
    .matches(specialCharacterRegex, 'Não são permitidos caracteres especiais'),
  city: Yup.string()
    .required('Informar a cidade é obrigatório.')
    .matches(specialCharacterRegex, 'Não são permitidos caracteres especiais'),
  region: Yup.number()
    .typeError('')
    .transform((value) => (isNaN(value) ? undefined : value))
    .required('Informar o estado é obrigatório.'),
  newsEmail: Yup.boolean(),
  newsSMS: Yup.boolean(),
})
