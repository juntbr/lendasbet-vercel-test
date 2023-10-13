import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'
import useClientTranslations from '@/hooks/useClientTranslation'
import { Button } from 'design-system/button'

export default function TypeBanner1({ children, img, onClick }) {
  const { isLogged: logged } = useAuth()

  const { t } = useClientTranslations(['home', 'common'])

  const bannerMobile = logged
    ? '/images/bannersHome/banner-indique-e-ganhe-mobile.png'
    : '/images/bannersHome/signup-mobile.png'

  return (
    <>
      <div className="relative overflow-hidden lg:hidden">
        <Image
          src={bannerMobile}
          onClick={onClick}
          alt="banner"
          width={100}
          height={100}
          className="w-full h-auto rounded-lb"
          loader={({ width, quality }) =>
            `${bannerMobile}?w=${width}&q=${quality || 75}`
          }
        />
        {children}

        <Button
          onClick={onClick}
          className="absolute py-3 text-white border-none bottom-2 left-5 right-5 bg-background bg-opacity-80"
        >
          {t('Learn more')}
        </Button>
      </div>

      <div className="relative hidden overflow-hidden lg:block">
        <Image
          src={img}
          onClick={onClick}
          alt="banner"
          width={500}
          height={500}
          loader={({ width, quality }) =>
            `${img}?w=${width}&q=${quality || 75}`
          }
          className="w-full h-auto cursor-pointer rounded-lb"
        />

        {children}
      </div>
    </>
  )
}
