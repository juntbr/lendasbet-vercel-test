import { useAuth } from '@/hooks/useAuth'
import { AppContext } from 'contexts/context'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import PixBanner from '../BannersHome/PixBanner'
import TypeBanner1 from '../BannersHome/TypeBanner1'
import TypeBanner2 from '../BannersHome/TypeBanner2'
import { useModal } from '@/hooks/useModal'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'

const configSuspense = {
  suspense: true,
  ssr: false,
}

const DesktopSidebar = dynamic(() => import('@/components/Sidebar/Desktop'), {
  ...configSuspense,
})

export default function HomePage() {
  const { setDynamicUrl, setCurrentSidebar } = useContext(AppContext)

  const { t } = useTranslation(['common'])

  const { handleOpenModalSignup, handleOpenModalRAF } = useModal()

  const { isLogged: logged } = useAuth()

  const { push } = useRouter()

  const redirectToSports = () => {
    push({
      pathname: '/esportes',
    })
    setDynamicUrl('/')
  }

  useEffect(() => {
    setCurrentSidebar('Sport')
  }, [])

  const TEXT_CASINO = t(
    'Enjoy the best of the casino right in the palm of your hand! At Legends Bet you can have fun playing live casino, Blackjack, Roulette, slot and more!',
  )

  const TEXT_SPORT = t(
    'Enjoy the most complete sports betting platform on the market! We offer the widest variety of gaming options and markets, from beginners to the most advanced.',
  )

  const bannerDesktop = '/images/bannersHome/banner-desktop-signup.png'

  const bannerLoggedDesktop = '/images/bannersHome/banner-desktop-referral.png'

  return (
    <div className="relative flex flex-col w-full h-full min-h-screen p-4 mx-auto max-w-7xl lg:p-0">
      <DesktopSidebar />
      <div className="space-y-8 lg:ml-64">
        {!logged ? (
          <TypeBanner1 onClick={handleOpenModalSignup} img={bannerDesktop}>
            <div className="absolute flex flex-col space-y-2 left-5 top-5 lg:left-16 lg:top-16 lg:space-y-4">
              <h2 className="w-[220px] text-xl font-bold text-white lg:w-full lg:max-w-md lg:text-4xl">
                {t('Join us and receive the best offers.')}
              </h2>
              <span className="w-48 text-xs text-white lg:w-96 lg:text-lg">
                {t('Create your account now!')}
              </span>
              <button
                onClick={handleOpenModalSignup}
                className="!mt-8 hidden w-80 rounded-lb bg-background py-3 text-sm font-bold text-white shadow-2xl transition-all duration-300 ease-in-out hover:bg-background/80 lg:inline lg:uppercase"
              >
                {t('Sign up here')}
              </button>
            </div>
          </TypeBanner1>
        ) : (
          <TypeBanner1 onClick={handleOpenModalRAF} img={bannerLoggedDesktop}>
            <div className="absolute flex flex-col space-y-2 left-5 top-5 lg:left-16 lg:top-16 lg:space-y-4">
              <h2 className="w-32 text-2xl font-bold text-white lg:w-96 lg:text-4xl ">
                {t('Indicate a friend and earn rewards')}
              </h2>
              <span className="hidden w-64 text-sm text-white lg:flex lg:w-96 lg:text-lg">
                {t('Invite your friends to have fun with you and be rewarded!')}
              </span>
              <button
                onClick={handleOpenModalRAF}
                className="group relative !mt-8 hidden w-80 rounded-lb bg-background px-4 py-3 text-xs lg:text-sm font-bold text-white shadow-2xl transition-all duration-300 ease-in-out hover:bg-background/80 lg:inline lg:uppercase"
              >
                {t('Learn more')}
                <div className="absolute inset-0 w-full h-full transition-all duration-300 scale-0 rounded-lb group-hover:scale-100 group-hover:bg-neutral-40/5"></div>
              </button>
            </div>
          </TypeBanner1>
        )}

        <PixBanner />

        <div className="flex flex-col justify-around w-full space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <div className="flex flex-col flex-1 space-y-3">
            <div className="flex items-center space-x-3 lg:hidden">
              <Image
                src="/images/cartas.svg"
                alt="Cartas"
                width={24}
                height={24}
                className="w-6 h-6"
              />{' '}
              <h2 className="text-white">{t('Casino')}</h2>
            </div>
            <TypeBanner2
              onClick={() => push('/cassino')}
              type={t('Go to Casino')}
              text={TEXT_CASINO}
              bgImg={'/images/bannersHome/bannerCasino.svg'}
              gradient={
                'linear-gradient(89.58deg, #2C0E57 0.34%, #2F105F 99.65%)'
              }
              color={'text-[#C5A1FF]'}
              gradientBtn={'linear-gradient(90deg, #3E038E 0%, #2A0C55 100%)'}
            />
          </div>

          <div className="flex flex-col flex-1 space-y-3">
            <div className="flex items-center space-x-3 lg:hidden">
              <Image
                src="/images/soccer.svg"
                alt="bola de futebol"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <h2 className="text-white">{t('Sports')}</h2>
            </div>
            <TypeBanner2
              onClick={redirectToSports}
              type={t('Go to Sports')}
              text={TEXT_SPORT}
              bgImg={'/images/bannersHome/bannerSport.svg'}
              gradient={
                'linear-gradient(89.58deg, #5A2516 0.35%, #AD3C1C 99.65%)'
              }
              color={'text-[#FFBCA1]'}
              gradientBtn={' linear-gradient(90deg, #B73B17 0%, #74250F 100%)'}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
