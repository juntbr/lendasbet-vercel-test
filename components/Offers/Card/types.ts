import { DetailedHTMLProps, HTMLAttributes } from 'react'

export interface CardProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  bannerImg: string
  title: string
  subtitle?: string
  slug: string
}
