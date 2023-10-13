export enum IconsFilename {
  favorite = 'Favorite',
  fire = 'Fire',
  providers = 'Dice',
  mybets = 'Bill',
  sports = 'BasketBall',
  liveSports = 'Live',
  referafriend = 'ReferAFriend',
  bonus100 = 'Bonus100',
  freespins = 'FortuneWheel',
  freebet = 'FreeBet',
  settings = 'Cog',
  ball = 'Ball',
}

export type SubItem = {
  name: string
  link?: string
  icon?: keyof typeof IconsFilename
  hide?: boolean
  onClick?: () => void
  promotions?: boolean
  favorites?: boolean
  populars?: boolean
  kindOfGames?: boolean
  recentlyGames?: boolean
  allSports?: boolean
  popularMatches?: boolean
  caret?: boolean
  open?: boolean
  setOpen?: (value: boolean) => void
  defaultOpen?: boolean
}

export type MenuItem = {
  name?: string
  sub: SubItem[] | false
  onClick?: () => void
  border?: boolean
  defaultOpen?: boolean
}
