import { PromotionObject } from '../CategorySlider/types'

export interface PromotionsSliderProps {
  sliders: Array<PromotionObject>
}

export interface PromotionCategory {
  id: number
  count: number
  description: string
  link: string
  name: string
  slug: string
  taxonomy: string
  parent: number
  meta: any[]
  acf: {
    category_image: any
  }
  _links: any[]
}

export interface PromotionCategoryWithPromotions extends PromotionCategory {
  promotions: PromotionObject[]
}
