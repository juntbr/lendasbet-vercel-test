import { NextApiRequest, NextApiResponse } from 'next'
import { changeImages } from 'server/usecases/cassino/games/fetch-trending-games-optix'
import { fetchOptimoveIntelligentLayout } from 'server/usecases/cassino/optimove/fetch-optimove-layout'
import { Game } from 'types/casino'
import { v4 as uuid } from 'uuid'

export const runtime = 'nodejs'

// Force static pages
export const dynamic = 'force-static'

// CDN cache currently only works on nodejs runtime

// Revalidate in seconds
export const revalidate = 60

function transformGameData(data, areaTitle) {
  const areaData = data.layout.result.find(
    (data) => data.area.placement.title === areaTitle,
  )?.area.placement.result

  if (!areaData) {
    return []
  }

  return areaData.reduce((acc, current) => {
    acc.push({
      id: uuid(),
      slug: current.game.game_code,
      name: current.game.name,
      defaultThumbnail: current.game.imageURL,
    })
    return acc
  }, [])
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { userId, channel } = req.body

    try {
      const response = await fetchOptimoveIntelligentLayout(userId, channel)

      const recentlyPlayedGames = transformGameData(
        response,
        'cassino-recently-played-games',
      )
      const trendingGames = transformGameData(response, 'casino-trending-games')

      const trendingGamesWithNewImages = await Promise.all(
        trendingGames.map(async (game: Game) => {
          return changeImages(game)
        }),
      )

      const games = {
        recentlyPlayedGames,
        trendingGames: trendingGamesWithNewImages,
      }

      if (response) {
        res.setHeader(
          'Cache-Control',
          'public, s-maxage=10, stale-while-revalidate=59',
        )
        return res
          .status(200)
          .json({ error: false, message: 'Ok', data: games })
      }
    } catch (error) {
      return res.status(500).json({ error, message: 'Error' })
    }
  }

  return res.status(404).end()
}

export default handler
