import { NextApiRequest, NextApiResponse } from 'next'
import NodeCache from 'node-cache'
import { sendBadRequest, sendOk } from 'server/helpers/http-helper'
import fetchCassinoGames, {
  DataSource,
} from 'server/usecases/cassino/games/fetch-cassino-games'
import fetchTrendingGamesOptix, {
  addTrendingGamesOnGroupGames,
} from 'server/usecases/cassino/games/fetch-trending-games-optix'
import { getGamesToCurrentPlatform } from 'utils/getGamesToCurrentPlatform'

const CACHE_TTL = 900 // 15 minutes in seconds

const nodeCache = new NodeCache()

interface RequestQuery {
  datasource: DataSource
  id: string
}

function processGroupGames(groupGames, userAgent) {
  if (groupGames.length > 0) {
    return groupGames.map((groupGame) => {
      return {
        ...groupGame,
        games: {
          ...groupGame.games,
          items: getGamesToCurrentPlatform(groupGame?.games?.items, userAgent),
        },
      }
    })
  }

  return groupGames
}

async function fetchOrRetrieveGroupGames(
  datasource: DataSource,
  id: string,
  userAgent: string,
) {
  const cacheKey = `cassino-games-${datasource}`

  const cache = nodeCache.get(cacheKey)

  if (cache) return cache

  const groupGames = await fetchCassinoGames(datasource)

  const groupGamesWithOptix = await getOptimoveGames(id, groupGames)

  const optimizedGroupGames = processGroupGames(
    groupGamesWithOptix.items,
    userAgent,
  )

  nodeCache.set(cacheKey, optimizedGroupGames, CACHE_TTL)

  return optimizedGroupGames
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { datasource, id } = req.query as unknown as RequestQuery

    if (!datasource) return sendBadRequest(res, new Error('No datasource'))

    const userAgent = req.headers['user-agent']

    const groupGames = await fetchOrRetrieveGroupGames(
      datasource,
      id,
      userAgent,
    )

    res.setHeader(
      'Cache-Control',
      'public, s-maxage=900, stale-while-revalidate=59',
    )
    return sendOk(res, { data: groupGames })
  } catch (error) {
    console.error('Error in handler:', error)
  }
}

async function getOptimoveGames(id: string, groupGames: any) {
  const trendingGames = await fetchTrendingGamesOptix(id)

  const groupGamesWithTrendingGames = await addTrendingGamesOnGroupGames(
    trendingGames,
    groupGames.items,
  )

  groupGames.items = groupGamesWithTrendingGames

  return groupGames
}
