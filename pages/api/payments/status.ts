import { CashipApi, defaultHeaders } from 'services/Caship'
import { GatewayService } from 'services/GatewayService'
import { PaagService } from 'services/Paag'
import { GatewayType } from 'types/GatewayService'

const paagService = new PaagService()
// const gatewayService = new GatewayService({ currentGateway: paagService })

export default async function handler(req, res) {
  if (req.method === 'GET') {
    if (!req.query.id) {
      res.status(400).json({ message: 'Missing id' })
    }

    if (req.query.gatewayType === GatewayType.PAAG) {
      const response = await paagService.checkTransactionStatus(req.query.id)

      const { error, statusMessage } = await paagService.checkTransaction(response)

      return res.status(200).json({ error, status: statusMessage})
    }

    const { error, status, data } = await CashipApi(
      'transaction',
      {},
      defaultHeaders,
      req.query.id,
    )

    res.status(status).json({ error, status, data })
  }
  res.end()
}
