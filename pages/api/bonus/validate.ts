import { NextApiRequest, NextApiResponse } from 'next/types'
import { CashipApi, defaultHeaders } from 'services/Caship'
import { IsActiveUserSession } from 'services/GamMatrix/isActiveUserSession'
import PlayerApi, { playerApiFetch } from 'services/PlayerApi'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const sessionId = String(req.query.sessionId)

    if (!sessionId) {
      res.status(500).json({ message: 'Missing sessionid' })
      return false
    }

    let bonusCode = String(req.query.bonusCode)

    bonusCode = bonusCode.toUpperCase()

    if (!bonusCode) {
      res.status(400).json({ message: 'Missing bonusCode' })
      return false
    }

    const { isActive, userId } = await IsActiveUserSession(sessionId)

    if (!isActive) {
      res.status(500).json({ message: 'Invalid session' })
      return false
    }

    try {
      PlayerApi.defaults.headers.common['X-SessionId'] = sessionId

      const data = await playerApiFetch(
        `/${userId}/eligiblebonuses?bonusType=deposit&currency=BRL`,
      )

      if (!data?.bonuses) {
        res.status(500).json({ error: true, message: 'Usuário não tem bonus.' })
        return false
      }

      const bonus = data.bonuses.find((bonus) => {
        return bonus.code === bonusCode
      })

      if (!bonus) {
        res.status(400).json({ error: true, message: 'Bônus não existe.' })
        return false
      }

      res.status(200).json({ error: false, message: 'Bonus válido.' })
      return false
    } catch (e) {
      res
        .status(500)
        .json({ error: true, message: 'Falha na comunicação com a API.' })
      return false
    }
  }
  res.end()
}

export default handler
