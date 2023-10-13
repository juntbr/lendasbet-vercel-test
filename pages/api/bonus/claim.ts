import { CashipApi, defaultHeaders } from 'services/Caship'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    if (!req.query.id) {
      res.status(400).json({ message: 'Missing id' })
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
