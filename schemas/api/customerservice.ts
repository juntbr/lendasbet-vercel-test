import { object, string } from 'yup'

export const customerServiceSchema = object({
  userId: string().required(),
  customerService: string().required(),
  linkSent: string().required(),
  username: string().required(),
})
