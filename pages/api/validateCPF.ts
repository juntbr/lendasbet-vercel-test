import * as Sentry from '@sentry/node'

function shouldAllowPass(errorCode: number) {
  switch (errorCode) {
    case 1001: // créditos insuficientes
      return true
    case 1002: // conta suspensa
      return true
    case 1004: // pacote invalido
      return true
    case 1005: // instabilidade no sistema do cpfcnpj.com.br
      return true
    case 1006: // instabilidade no sistema do cpfcnpj.com.br
      return true
    default: // não permitir passar
      return false
  }
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const cpf = req.body.document.replace(/\D/g, '')
      if (!cpf) {
        throw new Error('Erro ao consultar CPF')
      }
      const url = `https://api.cpfcnpj.com.br/${process.env.CPFCNPJAPI}/${process.env.CPFCNPJAPI_PACOTE}/${cpf}`
      const cpfCnpjReq = await fetch(url)
      const cpfCnpj = await cpfCnpjReq.json()
      if (cpfCnpj.erroCodigo) {
        return res.status(400).json({
          error: true,
          data: cpfCnpj,
          message: cpfCnpj.erro,
          allowPass: shouldAllowPass(Number(cpfCnpj.erroCodigo)),
        })
      }
      return res.status(cpfCnpjReq.status).json({ error: false, data: cpfCnpj })
    } catch (e) {
      Sentry.captureException(e)

      if (e.message) {
        return res.status(400).json({
          error: true,
          data: null,
          message: e.message,
          allowPass: false,
        })
      }
      return res.status(500).json({
        error: true,
        data: null,
        message: 'Tivemos um erro na API',
        allowPass: true,
      })
    }
    // Process a POST request
  }
  return res.end()
}
