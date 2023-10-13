/* eslint-disable camelcase */
import { CategorySlider } from '@/components/Slider/CategorySlider'
import { PromotionsSlider } from '@/components/Slider/PromotionsSlider'
import {
  PromotionCategory,
  PromotionCategoryWithPromotions,
} from '@/components/Slider/PromotionsSlider/types'
import { Card } from '@/components/Offers/Card'
import axios from 'axios'
import absoluteUrl from 'utils/absoluteUrl'
import { PromotionObject } from '@/components/Slider/CategorySlider/types'
import { prepareContent } from './[slug]'
import Navbar from '../../components/Offers/Navbar'
import * as Sentry from '@sentry/nextjs'
import usePromotion from '@/hooks/usePromotions'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import nextI18nextConfig from 'next-i18next.config.cjs'

const AFFILIATED_PROMOTION_CATEGORY = 9

type OffersProps = {
  promotion_categories: PromotionCategoryWithPromotions[]
  slider_promotions: PromotionObject[]
}

const overview = {
  id: 1,
  name: 'Visão Geral',
  slug: '',
}

const Offers = ({ promotion_categories, slider_promotions }: OffersProps) => {
  const categories = promotion_categories.reduce((result, currentObject) => {
    const { id, name, slug } = currentObject
    result.push({ id, name, slug })
    return result
  }, [])

  categories.unshift(overview)

  const { activeCategory, setActiveCategory } = usePromotion()

  const filteredCategoryArr = !activeCategory
    ? []
    : promotion_categories.find(
        (category: PromotionCategory) => category.slug === activeCategory,
      ).promotions

  return (
    <main className="flex flex-col items-start justify-start w-full p-4 mx-auto mb-10 max-w-7xl space-y-7 sm:min-h-screen sm:px-6">
      <PromotionsSlider sliders={slider_promotions} />

      <Navbar categories={categories} />

      {!activeCategory ? (
        promotion_categories.map(
          (categorySliderData: PromotionCategoryWithPromotions) => (
            <CategorySlider
              key={categorySliderData.id}
              categoryDescription={categorySliderData.description}
              categoryName={categorySliderData.name}
              categoryImage={categorySliderData.acf?.category_image ?? ''}
              handleSeeAllFunction={() =>
                setActiveCategory(categorySliderData.slug)
              }
              promotionCardArray={categorySliderData.promotions}
              breakpoints={{
                240: {
                  slidesPerView: 1.3,
                },
                420: {
                  slidesPerView: 2.4,
                },
                768: {
                  slidesPerView: 3.4,
                },
                1024: {
                  slidesPerView: 4.4,
                },
              }}
            />
          ),
        )
      ) : (
        <ul className="grid w-full h-full grid-cols-1 px-8 gap-x-4 gap-y-4 sm:grid-cols-2 sm:px-0 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCategoryArr.map((category: PromotionObject) => {
            const { title, subtitle } = prepareContent(category)
            return (
              <li key={category.id} className="h-[150px] w-full">
                <Card
                  bannerImg={category.fimg_url}
                  title={title}
                  subtitle={subtitle}
                  slug={category.slug}
                />
              </li>
            )
          })}
        </ul>
      )}
    </main>
  )
}

export default Offers

async function getPromotionsByCategory(origin, category: PromotionCategory) {
  const { data: promotions } = await axios.get(
    `${origin}/api/wp?path=${encodeURIComponent(
      `promotions?promotion_category=${category.id}&per_page=50`,
    )}`,
  )

  return {
    ...category,
    promotions,
  }
}

async function getSliderPromotions(origin) {
  const url = `${origin}/api/wp?path=promotions${encodeURIComponent(
    '?',
  )}promotion_category_exclude=${AFFILIATED_PROMOTION_CATEGORY}&status=published&per_page=50`

  const { data: promotions } = await axios.get(url)

  return promotions
}

export async function getStaticProps(context) {
  const origin =
    process.env.NEXT_PUBLIC_BASE_URL ?? absoluteUrl(context.req).origin

  try {
    const apiURL = `${origin}/api/wp?path=promotion_category?acf_format=standard`

    const { data } = await axios.get(apiURL)

    const requests = data.map(
      async (category) => await getPromotionsByCategory(origin, category),
    )

    const promotion_categories = await Promise.all(requests)

    const slider_promotions = await getSliderPromotions(origin)

    return {
      props: {
        promotion_categories: JSON.parse(
          JSON.stringify(promotion_categories),
        ).filter((item) => item.id !== 9),
        slider_promotions: JSON.parse(JSON.stringify(slider_promotions)),
        ...(await serverSideTranslations(
          context.locale,
          ['common'],
          nextI18nextConfig,
        )),
      },
      revalidate: 28800, // 8 horas
    }
  } catch (e) {
    Sentry.captureException(e)

    return {
      notFound: true,
    }
  }
}
