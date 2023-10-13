import { Game } from './casino'

export interface FavoriteItem {
  slug: string
  gameModel: Game
}

export interface FavoritesResponse {
  count: number
  items: FavoriteItem[]
}

export interface BonusWalletItem {
  walletId: number
  bonusId: string
  status: string
  name: string
  bonusCode: string
  type: string
  triggerType: string
  fulfilledWR: number
  grantedAmount: number
  currentAmount: number
  lockedAmount: number
  totalWR: number
  currency: string
  originalWageringRequirement: number
  remainingWageringRequirement: number
  originalWageringRequirementCurrency: string
  expiryTime: string
  freeRoundNumber: number
  granted: string
}

export interface BonusWalletResponse {
  items: BonusWalletItem[]
}
