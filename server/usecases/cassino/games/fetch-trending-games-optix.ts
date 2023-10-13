import axios from 'axios'
import { v4 as uuid } from 'uuid'
import { CasinoGroup, Game } from 'types/casino'
import { fetchOptimoveIntelligentLayout } from '../optimove/fetch-optimove-layout'

function createImageUrl(game: Game) {
  const isDevelopment = process.env.NODE_ENV === 'development'
  const baseUrl = isDevelopment
    ? 'http://localhost:3000'
    : 'https://lendasbet.com'

  const image = `/images/games/${game.slug}.svg`
  const url = baseUrl + image

  return url
}

export async function checkImageAvailability(game: Game) {
  const url = createImageUrl(game)

  try {
    const response = await axios.head(url)
    return response.status
  } catch (error) {
    // console.error('Error:', error.message)
  }
}

export async function changeImages(game: Game) {
  const url = createImageUrl(game)

  try {
    const status = await checkImageAvailability(game)
    if (status === 200) game.defaultThumbnail = url
    return game
  } catch (error) {
    console.error('Error checking image availability:', error)
    return game
  }
}

export async function addTrendingGamesOnGroupGames(
  trendingGames,
  groupGames: CasinoGroup[],
) {
  const newGroupGames = await Promise.all(
    groupGames.map(async (groupGame: CasinoGroup) => {
      if (groupGame.id === 'TESTELOBBY$em-alta') {
        const { games } = groupGame
        const newGroupGame = { ...groupGame }

        if (trendingGames.length > 0) {
          games.items = trendingGames || games.items
          games.total = trendingGames.length
          games.count = trendingGames.length
        }

        const newItems = await Promise.all(
          games.items.map(async (game: Game) => {
            return changeImages(game)
          }),
        )

        newGroupGame.games.items = newItems
        return newGroupGame
      }
      return groupGame
    }),
  )

  return newGroupGames
}

export function transformGameData(data, areaTitle) {
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

export default async function fetchTrendingGamesOptix(id: string) {
  const parts = id.split('-')
  const channel = parts.pop()
  const userId = parts.join('-')

  const response = await fetchOptimoveIntelligentLayout(userId, channel)

  const trendingGames = transformGameData(response, 'casino-trending-games')
  return trendingGames
}
