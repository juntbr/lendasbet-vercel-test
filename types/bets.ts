export interface BetsResponse {
  successful: boolean;
  response: BetsResponseObject;
}

interface BetsResponseObject {
  success: boolean;
  errorCode?: string;
  errorMessage?: string;
  totalRecords: number;
  responseRecords: number;
  betList: BetListReponse[];
}

interface BetListReponse {
  betId: string;
  userName: string;
  userId: number;
  ucsOperatorId: number;
  selections: BetsSelections[];
  type: string;
  systemBetType?: string;
  amount: number;
  amountEur: number;
  totalBetAmount: number;
  totalBetAmountEur: number;
  freeBetAmount: number;
  bonusBetAmount: number;
  currency: string;
  maxWinning: number;
  possibleProfit: number;
  possibleProfitEur: number;
  totalPriceValue: number;
  numberOfSelections: number;
  status: string;
  statusLabel: string;
  placedDate: Date;
  settledDate?: Date;
  placementStatusConfirmedDate: Date;
  freeBet: boolean;
  oddsBoost: boolean;
  betBuilder: boolean;
  mbaBet: boolean;
  extraBetInfo: string;
  eachWay: boolean;
  currentPossibleWinning: number;
  totalBalanceImpact: number;
  betPayout?: number;
  terminalType: string;
  amountCashOut: number;
}

export enum BetStatus {
  WON = "WON",
  LOST = "LOST",
  OPEN = "OPEN",
  HALF_WON = "HALF_WON",
  HALF_LOST = "HALF_LOST",
  DRAW = "DRAW",
  CASHED_OUT = "CASHED_OUT",
  VOID = "VOID",
  CANCELLED = "CANCELLED",
  PENDING = "PENDING",
  REJECTED = "REJECTED",
}

export enum BetStatusLabel {
  "WON" = "GANHOU",
  "LOST" = "PERDEU",
  "OPEN" = "ABERTA",
  "HALF_WON" = "MEIO GANHO",
  "HALF_LOST" = "MEIO PERDIDO",
  "DRAW" = "EMPATE",
  "CASHED_OUT" = "ENCERRADA",
  "VOID" = "VAZIO",
  "CANCELLED " = "DEVOLVIDA",
  "PENDING" = "PENDENTE",
  "REJECTED" = "REJEITADA",
}

export enum BetType {
  "SINGLE" = "SIMPLES",
  "MULTIPLE" = "MÚLTIPLO (a)",
  "SYSTEM" = "SISTEMA",
}

export interface OutcomeEntity {
  id: string;
  typeId: string;
  isNegation: boolean;
  statusId: string;
  eventId: string;
  eventPartId: string;
  paramParticipantId1: string;
  code: string;
}

export interface BetSelection {
  outcomeId: string;
  requestedStatus: string;
  committedStatus: string;
  requestedSelectionStatus: string;
  cashedOut: boolean;
  statusLabel: string;
  initialPriceValue?: any;
  priceValue: number;
  betBuilderOdds?: any;
  initialBetBuilderOdds?: any;
  sportId: string;
  sportName: string;
  sportParentId?: any;
  sportParentName?: any;
  venueId: string;
  venueName: string;
  tournamentId: string;
  tournamentName: string;
  eventId: string;
  eventTypeId: string;
  eventName: string;
  homeParticipantId: string;
  awayParticipantId: string;
  homeParticipantName: string;
  awayParticipantName: string;
  homeParticipantLogoUrl: string;
  awayParticipantLogoUrl: string;
  eventResult: string;
  eventScoreAtPlaceBet?: any;
  eventDate: Date;
  bettingTypeId: string;
  bettingTypeName: string;
  bettingTypeEventPartId: string;
  bettingTypeEventPartName: string;
  betName: string;
  shortBetName: string;
  marketName: string;
  selectionActualStatusSettlementDate?: any;
  isLive: boolean;
  outcomeEntity: OutcomeEntity;
  cashOutDate?: any;
  cashOutOdds?: any;
  cashOutBetBuilderOdds?: any;
  eventStatusId: string;
  currencyPair?: any;
  exchangeRateTimestamp?: any;
  exchangeRate?: any;
  exchangeRateTimestampAtSettlement?: any;
  exchangeRateAtSettlement?: any;
  selectionOrderNumber: string;
  actualBetBuilderGroupSettlementStatus?: any;
  desiredBetBuilderGroupSettlementStatus?: any;
  priceValueByStatus: number;
  status: string;
}

export interface BetObject {
  betId: string;
  userName: string;
  userId: string;
  ucsOperatorId: string;
  selections: BetSelection[];
  type: BetType;
  systemBetType?: any;
  amount: number;
  amountEur: number;
  totalBetAmount: number;
  totalBetAmountEur: number;
  freeBetAmount: number;
  bonusBetAmount: number;
  currency: string;
  maxWinning: number;
  possibleProfit: number;
  possibleProfitEur: number;
  totalPriceValue: number;
  numberOfSelections: number;
  status: string;
  statusLabel: string;
  placedDate: Date;
  settledDate?: any;
  placementStatusConfirmedDate: Date;
  freeBet: boolean;
  oddsBoost: boolean;
  betBuilder: boolean;
  mbaBet: boolean;
  extraBetInfo?: any;
  operatorName: string;
  eachWay: boolean;
  currentPossibleWinning: number;
  totalBalanceImpact: number;
  betPayout?: any;
  terminalType: string;
  amountCashOut: number;
  totalBetAmountTax: number;
  totalBetAmountEurTax: number;
  totalBetAmountNetto: number;
  maxWinningTax: number;
  maxWinningNetto: number;
  betPayoutTax?: any;
  totalPayoutTax?: any;
  betStakeNet: number;
  betStakeNetEur: number;
  partialCashOuts: any[];
  betRemainingStake: number;
  overallBetReturns?: any;
  overallCashoutAmount?: any;
  cashOutDate?: any;
  totalPriceValueByBetStatus: number;
  betNetReturns?: any;
  potentialNetReturns?: any;
  potentialWinTax?: any;
}
