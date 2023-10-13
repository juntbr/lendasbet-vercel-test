export interface Link {
  target?: string
  title?: string
  url?: string
}

export interface Acf {
  text?: string
  location: 'slot' | 'live' | 'both'
  type: 'image' | 'video'
  image?: string
  video?: string
  interactive: boolean
  interactive_type: 'game' | 'link'
  game?: string
  open_link?: Link
}
export interface Banner {
  title: {
    rendered: string
  }
  acf: Acf
}

export type Banners = Banner[]
