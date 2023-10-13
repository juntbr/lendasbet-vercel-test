interface Game {
  game_code: string
  score: number
  score_breakdown: string
  imageURL: string | null
  extra: string | null
  formFactors: string[]
  gameCode: string
  description: string | null
  formattedSummaryShort: string | null
  gameType: string
  name: string
  rtp: number
  rank: number
}

interface Result {
  game: Game
}

interface Placement {
  title: string
  subtitle: string
  placementKey: string
  result: Result[]
  explanation: object
  extra: object
}

interface Area {
  index: number
  name: string
  placement: Placement
}

interface Layout {
  layoutId: string
  layoutDateTime: string
  result: Area[]
}

export interface LayoutResponse {
  layout: Layout
}
