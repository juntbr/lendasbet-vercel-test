import { Game } from 'types/casino'
import { getOperatingSystemByUserAgent } from './getOperationSystem'

interface GameOptimized extends Partial<Game> {
  isOptimized: boolean
}

export function getGamesToCurrentPlatform(
  games: Game[],
  userAgent: string,
): GameOptimized[] {
  if (!Array.isArray(games) || games.length === 0) {
    return []
  }

  const currentPlatform = getOperatingSystemByUserAgent(userAgent)

  const optimizedGamesMap = new Map<number | string, GameOptimized>()

  for (const game of games) {
    if (!game.platform) {
      optimizedGamesMap.set(game.id, {
        ...game,
        isOptimized: false,
      })
      continue
    }

    const isOptimized = game.platform.includes(currentPlatform)

    if (!optimizedGamesMap.has(game.gameId) || isOptimized) {
      optimizedGamesMap.set(game.gameId, {
        ...game,
        isOptimized,
      })
    }
  }

  return Array.from(optimizedGamesMap.values())
}
