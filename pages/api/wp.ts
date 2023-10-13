import WP from 'services/WP'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const path = String(req.query.path)
    if (!path) {
      res.status(500).json({ message: 'Missing path' })
      return false
    }

    try {
      const response = await WP.get(path)
      res.status(200).json(response.data)
    } catch (error) {
      console.log(error)
      res
        .status(500)
        .json({ error: true, message: 'Falha na comunicação com a API.' })
    }
  }
  res.end()
}
