import GetUserIp from 'services/GetUserIp'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const userIp = (await GetUserIp(req)).ip
    return res.json(userIp)
  }
  res.end()
}
