export interface Title {
  rendered: string
}

export interface Acf {
  text: string
  location: string
  type: string
  image: string
  video: string
  interactive: boolean
  interactive_type: string
  game: string
  open_link: string
}
export interface Banner {
  title: Title
  acf: Acf
}

export interface WordpressResponse {
  data: Banner[]
  latency: number
}
