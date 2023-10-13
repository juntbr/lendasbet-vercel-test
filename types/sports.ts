export enum LiveStatus {
  LIVE = "LIVE",
  NOT_LIVE = "NOT_LIVE",
  BOTH = "BOTH",
}

export interface Tournaments {
  _type: "TOURNAMENT";
  id: number;
  idAsString: "5";
  name: string;
}

export interface TournamentsRequestParams {
  lang?: string;
  liveStatus?: LiveStatus;
  sortByPopularity?: boolean;
  maxResults?: number;
}

export interface Tournament {
  _type: string
  id: string
  typeId: string
  sportId: string
  templateId: string
  name: string
  startTime: number
  endTime: number
  venueId: string
  statusId: string
  rootPartId: string
  categoryId: string
  numberOfMarkets: number
  numberOfBettingOffers: number
  numberOfLiveMarkets: number
  numberOfLiveBettingOffers: number
  typeName: string
  sportName: string
  shortSportName: string
  templateName: string
  venueName: string
  shortVenueName: string
  statusName: string
  rootPartName: string
  shortRootPartName: string
  translatedName: string
  shortTranslatedName: string
  numberOfEvents: number
  numberOfUpcomingMatches: number
  numberOfOutrightMarkets: number
  numberOfLiveEvents: number
  showEventCategory: boolean
  categoryName: string
  displayChildren: boolean
  layoutStyle: string
}


export interface Match {
  _type: "MATCH";
  id: string;
  name: string;
  parentName: string;
  shortParentName: string;
  currentPartName?: string;
  shortName: string;
  startTime: number;
  homeParticipantName: string;
  awayParticipantName: string;
  homeShortParticipantName: string;
  awayShortParticipantName: string;
  shortTranslatedName: string;
}

export interface Outcome {
  _type: "OUTCOME";
  id: number;
  idAsString: string;
  eventId: string;
  typeName: string;
  eventPartName: string;
}

export interface BettingOffer {
  _type: "BETTING_OFFER";
  id: string;
  bettingTypeId: string;
  bettingTypeName: string;
  isAvailable: boolean;
  isLive: boolean;
  lastChangedTime: number;
  odds: number;
  outcomeId: string;
  providerId: string;
  shortBettingTypeName: string;
  statusId: string;
}
export interface Sport {
  _type: string;
  id: number;
  idAsString: string;
  name: string;
  shortName: string;
  isVirtual: boolean;
  numberOfEvents: number;
  numberOfMarkets: number;
  numberOfBettingOffers: number;
  numberOfLiveEvents: number;
  numberOfLiveMarkets: number;
  numberOfLiveBettingOffers: number;
}

// export interface Tournament {
//   lang: string;
//   sportId: number;
//   venueId: number;
//   tournamentId: number;
//   dataWithoutOdds: boolean;
//   sortByPopularity: boolean;
//   sortAlphabetically: boolean;
//   liveStatus: string;
//   maxResults: number;
//   eventTemplateIds: number[];
// }

export interface Location {
  _type: string;
  id: number;
  sportId: string;
  idAsString: string;
  typeId: number;
  name: string;
  shortName: string;
  code: string;
  numberOfEvents: number;
  numberOfMarkets: number;
  numberOfBettingOffers: number;
  numberOfLiveEvents: number;
  numberOfLiveMarkets: number;
  numberOfLiveBettingOffers: number;
  shortSportName: string;
  categoryName: string;
  venueId: number;
}
