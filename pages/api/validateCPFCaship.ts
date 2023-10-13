import * as Sentry from '@sentry/node'
import { CashipApi } from 'services/Caship'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const cpf = req.body.document.replace(/\D/g, '')
      const params = {
        cpf,
      }

      if (!cpf) {
        throw new Error('Erro ao consultar CPF')
      }

      const { error, status, data } = await CashipApi('validateCPF', params)

      return res.status(status).json({ error, status, data })
    } catch (error) {
      Sentry.captureException(error)

      return res.status(400).json({
        error,
        data: error.data,
        message: error.data,
      })
    }
  }
  return res.end()
}
