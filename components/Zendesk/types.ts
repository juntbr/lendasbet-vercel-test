declare global {
  interface Window {
    zE?: any
    zESettings?: any
  }
}

export interface ZendeskParams {
  zendeskKey: string
  lang?: string
}
