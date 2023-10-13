import { SwiperOptions } from 'swiper'

export interface PromotionObject {
  id: number
  date: string
  date_gmt: string
  guid: { rendered: string }
  modified: string
  modified_gmt: string
  slug: string
  status: string
  type: string
  link: string
  title: { rendered: string }
  content: { rendered: string; protected: boolean }
  excerpt: any
  author: number
  featured_media: number
  comment_status: string
  ping_status: string
  template: string
  meta: any[]
  promotion_category: number[]
  acf: {
    terms_and_conditions: string
  }
  fimg_url: string
  _links: any[]
}

export type PromotionCardProps = PromotionObject

export interface CategorySliderProps {
  categoryName: string
  categoryDescription?: string | undefined
  categoryImage?: string | undefined
  promotionCardArray: Array<PromotionCardProps>
  onClickCard?: (url: string) => void | undefined
  handleSeeAllFunction?: () => void | undefined
  className?: string | undefined
  breakpoints?:
    | {
        [width: number]: SwiperOptions
        [ratio: string]: SwiperOptions
      }
    | undefined
}
