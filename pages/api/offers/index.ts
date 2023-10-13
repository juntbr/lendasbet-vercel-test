import axios from 'axios'
import WP from 'services/WP'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    await axios.post(
      `https://marketinglendasbet.activehosted.com/proc.php?u=7&f=7&s=&c=0&m=0&act=sub&v=2&or=0bde851fcda66a8c841715df54f3cd90&email=${req.body.email}`,
      { Headers: { 'content-type': 'application/x-www-form-urlencoded' } },
    )

    return res.json({
      ok: true,
    })
  }

  if (req.method === 'GET') {
    try {
      const path = 'promotions?promotion_category=5,6&per_page=5'

      const response = await WP.get(path)
      res.status(200).json(response.data)
    } catch (error) {
      console.log(error)
      res
        .status(500)
        .json({ error: true, message: 'Falha na comunicação com a API.' })
    }
  }

  return res.end()
}
