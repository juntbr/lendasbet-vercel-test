import { NextApiRequest, NextApiResponse } from 'next'
import { sendBadRequest, sendOk } from 'server/helpers/http-helper'
import fetchCassinoGames, {
  DataSource,
} from 'server/usecases/cassino/games/fetch-cassino-games'

interface RequestQuery {
  datasource: DataSource
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { datasource } = req.query as unknown as RequestQuery

    if (!datasource) return sendBadRequest(res, new Error('No datasource'))

    const groupGames = await fetchCassinoGames(datasource)

    return sendOk(res, groupGames)
  } catch (error) {
    console.error('Error in handler:', error)
  }
}
