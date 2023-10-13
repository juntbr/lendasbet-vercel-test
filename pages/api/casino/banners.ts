import Redis from 'ioredis'
import { NextApiRequest, NextApiResponse } from 'next'
import { sendOk, sendServerError } from 'server/helpers/http-helper'
import { fetchCassinoBannersFromWordpress } from 'server/usecases/cassino/banners/fetch-cassino-banners-from-wordpress'
import { WordpressResponse } from 'server/usecases/cassino/banners/types'

const redisClient = new Redis(process.env.UPSTASH_REDIS_API_URI)

const CACHE_TTL = 604800

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const startTime = Date.now()

    const cachedBanners = await redisClient.get('cassino-banners')
    const response: WordpressResponse = { data: [], latency: 0 }

    if (cachedBanners) {
      response.data = JSON.parse(cachedBanners)
      response.latency = Date.now() - startTime
      return sendOk(res, response.data)
    }

    const apiStartTime = Date.now()
    const banners = await fetchCassinoBannersFromWordpress()

    banners.sort((a: any, b: any) => b.todayCases - a.todayCases)

    response.data = banners.slice(0, 10)
    response.latency = Date.now() - apiStartTime

    await redisClient.set(
      'cassino-banners',
      JSON.stringify(response.data),
      'EX',
      CACHE_TTL,
    )

    res.setHeader(
      'Cache-Control',
      'public, s-maxage=604800, stale-while-revalidate=59',
    )
    return sendOk(res, response.data)
  } catch (error) {
    return sendServerError(res, new Error('Could not fetch cassino banners'))
  }
}

export default handler
