import { useEffect, useMemo, useState } from 'react'
import router, { useRouter } from 'next/router'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'
import { Breadcrumber } from '@/components/Breadcrumber'
import { CategorySlider } from '@/components/Slider/CategorySlider'
import axios from 'axios'
import { useAuth } from '@/hooks/useAuth'
import Cookies from 'js-cookie'
import Image from 'next/image'
import LoadingSpinnerCasino from '@/components/Loadings/LoadingSpinnerCasino'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import nextI18nextConfig from 'next-i18next.config.cjs'
import { useTranslation } from 'next-i18next'
import { useModal } from '@/hooks/useModal'

export function prepareContent(promotion) {
  const TERMS_AND_CONDITIONS = promotion.acf?.terms_and_conditions

  const title = promotion.title.rendered

  const rawContent = promotion.content?.rendered
  const content = rawContent

  const subtitle = promotion.acf.subtitle ? promotion.acf.subtitle : ''

  return {
    title,
    subtitle,
    content,
    TERMS_AND_CONDITIONS,
  }
}

function Offers() {
  const { t } = useTranslation(['common'])
  const { isLogged } = useAuth()

  const [loading, setLoading] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [promotion, setPromotion] = useState({
    id: '',
    title: { rendered: '' },
    content: {
      rendered: '',
    },
    acf: {
      terms_and_conditions: '',
    },
    fimg_url: '',
    promotion_category: [],
  })
  const [relatedPromotions, setRelatedPromotions] = useState([])

  const router = useRouter()
  const { handleOpenModalOfferNotAllowedUnlogged } = useModal()

  async function getRelatedPromotionData(promotionData) {
    try {
      const promotion_category_query =
        promotionData.promotion_category.length > 0
          ? '%26promotion_category=' + promotionData.promotion_category[0]
          : ''
      const { data } = await axios.get(
        `/api/wp?path=${encodeURIComponent(
          `promotions?exclude=${promotionData.id}`,
        )}` + promotion_category_query,
      )
      setRelatedPromotions(data)
    } catch (e) {}
  }

  async function getPromotionData() {
    try {
      setLoading(true)
      const { data } = await axios.get(
        `/api/wp?path=${encodeURIComponent(
          `promotions?slug=${router.query.slug}`,
        )}`,
      )
      setLoading(false)

      if (data.length === 0) {
        router.push('/promocoes')
      } else {
        const promotionData = data[0]
        setPromotion(promotionData)
        getRelatedPromotionData(promotionData)
      }
    } catch (e) {
      router.push('/promocoes')
      setLoading(false)
    }
  }

  useEffect(() => {
    if (router.query.slug) {
      getPromotionData()
    } else {
      router.push('/promocoes')
    }
  }, [router.query.slug])

  useEffect(() => {
    typeof window !== 'undefined' &&
      window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const isNotAffiliated = useMemo(() => {
    if (!promotion.promotion_category) return true

    return promotion.promotion_category[0] !== 9
  }, [promotion])

  useEffect(() => {
    const hasSentTheEmail = Cookies.get('hasSubscribedEmail')

    const timer = setTimeout(async () => {
      if (!isLogged && hasSentTheEmail !== 'true' && isNotAffiliated) {
        await router.push('/promocoes')
        handleOpenModalOfferNotAllowedUnlogged()
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [isLogged, promotion])

  const { title, content, subtitle, TERMS_AND_CONDITIONS } =
    prepareContent(promotion)

  const data = {
    banner: promotion.fimg_url,
    title,
    subtitle,
    content,
    conditions: TERMS_AND_CONDITIONS,
    category: 'casino',
  }

  const pages = [
    { name: t('Promotions'), href: '/promocoes', current: false },
    { name: data.title, href: '#', current: true },
  ]

  if (loading) return <LoadingSpinnerCasino />

  return (
    <div className="flex flex-col items-start justify-start w-full p-4 mx-auto mb-10 max-w-7xl sm:min-h-screen">
      <Breadcrumber pages={pages} />
      <div className="relative w-full mt-2">
        {data.banner && (
          <Image
            src={data.banner}
            alt={data.title}
            className="mx-auto h-full w-full rounded-lb lg:max-h-[600px] lg:max-w-7xl"
            width={400}
            height={400}
            sizes="100vw"
            loader={({ width, quality }) =>
              `${data.banner}?w=${width}&q=${quality || 75}`
            }
          />
        )}

        <div className="absolute flex flex-col w-3/5 space-y-1 bottom-3 left-2 lg:bottom-10 lg:left-10">
          <h1 className="text-xl font-extrabold text-white lg:text-5xl">
            {data.title}
          </h1>
          <p className="text-neutral-20 lg:text-xl">{data.subtitle}</p>
        </div>
      </div>

      <div className="w-full mx-auto mt-6 lg:mt-8 ">
        <div
          dangerouslySetInnerHTML={{ __html: data.content }}
          className="px-1 leading-5 prose text-white max-w-none prose-a:text-neutral-10 prose-strong:text-neutral-10"
        />

        <div
          onClick={() => setShowTerms(!showTerms)}
          className="flex justify-between w-full p-4 mb-3 transition rounded cursor-pointer mt-7 bg-secondary hover:bg-opacity-80"
        >
          <p className="text-base font-bold text-neutral-20">
            {t('Terms and Conditions')}
          </p>
          {!showTerms ? (
            <ChevronDownIcon className="w-6 text-neutral-20" />
          ) : (
            <ChevronUpIcon className="w-6 text-neutral-20" />
          )}
        </div>

        {showTerms && (
          <div className="flex flex-col w-full prose max-w-none">
            <div
              dangerouslySetInnerHTML={{ __html: data.conditions }}
              className="space-y-1 prose max-w-none text-neutral-20"
            />
          </div>
        )}
        {isNotAffiliated && (
          <CategorySlider
            className="mt-10"
            categoryName={t('Similar offers')}
            promotionCardArray={relatedPromotions}
            breakpoints={{
              240: {
                slidesPerView: 1.3,
              },
              420: {
                slidesPerView: 1.4,
              },
              768: {
                slidesPerView: 2.4,
              },
              1024: {
                slidesPerView: 4.4,
              },
              2500: {
                slidesPerView: 2.3,
              },
            }}
          />
        )}
      </div>
    </div>
  )
}

export default Offers

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'], nextI18nextConfig)),
    },
  }
}
