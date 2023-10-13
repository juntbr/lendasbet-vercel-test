import '../styles/betslip.css'
import '../styles/ellipsis.css'
import '../styles/fasttrack.css'
import '../styles/globals.css'
import '../styles/iframe.css'
import '../styles/policies.css'
import '../styles/video-player.css'
import '../styles/wordpress.css'

import 'keen-slider/keen-slider.min.css'
import 'react-toastify/dist/ReactToastify.css'
import 'swiper/css'
import 'swiper/css/autoplay'
import 'swiper/css/bundle'
import 'swiper/css/pagination'

import { DefaultSeo } from 'next-seo'
import Head from 'next/head'
import NextNProgress from 'nextjs-progressbar'
import { ToastContainer } from 'react-toastify'
import { sessionConfig } from 'config'
import { appWithTranslation, useTranslation } from 'next-i18next'
import nextI18nConfig from '../next-i18next.config.cjs'
import FastTrack from '@/components/FastTrack'
import FTNotifications from '@/components/FastTrack/Notifications'
import LoadingFallback from '@/components/Loadings/LoadingFallback'
import Optimove from '@/components/Optimove'
import Recaptcha from '@/components/Recaptcha'
import { Zendesk } from '@/components/Zendesk'
import { WindowSizeProvider } from '@/hooks/UseWindowSize'
import PixelProvider from '@/hooks/useAffiliatePixel/PixelProvider'
import Pixels from '@/hooks/useAffiliatePixel/Pixels'
import { ModalProvider } from '@/hooks/useModal'
import { GoogleOAuthProvider } from '@react-oauth/google'
import ProfileDataProvider from 'hooks/useProfileData'
import { Modal } from '@/hooks/useModal/Modal'
import { AppContextProvider } from '../contexts/context'
import { SessionProvider } from '../hooks/useSession'
import DefaultLayout from '../layouts/default'
import { PromotionProvider } from '@/hooks/usePromotions'
import { useGetCouponFromParam } from '@/hooks/useGetCouponFromParam'
import { BtagProvider, useBtag } from '@/hooks/useBtag'
import { useIntelligentLayouts } from '@/hooks/useOptix/useIntelligentLayouts'
import { usePixelFacebook } from '@/hooks/usePixelFacebook'
import {
  GoogleTagManagerProvider,
  useGoogleTagManager,
} from '@/hooks/useGoogleTagManager'

function MyApp({ Component, pageProps }) {
  const { t } = useTranslation(['common'])

  const getLayout =
    Component.getLayout || ((page) => <DefaultLayout>{page}</DefaultLayout>)

  useGetCouponFromParam()
  useBtag()
  useIntelligentLayouts()
  usePixelFacebook()
  useGoogleTagManager()

  if (pageProps.noApp) return getLayout(<Component {...pageProps} />)

  return (
    <>
      <DefaultSeo
        titleTemplate="%s | Lendas Bet: Apostas Esportivas - Ganhou, Sacou!"
        defaultTitle="Lendas Bet: Apostas Esportivas - Ganhou, Sacou!"
        description="Saque rápido, suporte personalizado, as melhores odds e cotações de apostas ao vivo e os melhores jogos de cassino. Seja uma lenda! Conheça agora o nosso site!"
      />
      <Head>
        <meta
          name="viewport"
          content="width=device-width,minimum-scale=1,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover"
        />
      </Head>
      <NextNProgress
        nonce="my-nonce"
        color="#1EC355"
        height={3}
        showOnShallow={true}
        options={{ easing: 'ease', speed: 500, showSpinner: false }}
      />
      <BtagProvider>
        <GoogleTagManagerProvider>
          <WindowSizeProvider>
            <SessionProvider
              config={sessionConfig}
              fallback={<LoadingFallback />}
            >
              <GoogleOAuthProvider
                clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID}
              >
                <ModalProvider>
                  <PromotionProvider>
                    <AppContextProvider>
                      <PixelProvider>
                        <Pixels />
                        <FTNotifications />
                        <ProfileDataProvider>
                          {getLayout(<Component {...pageProps} />)}
                          <Modal />
                        </ProfileDataProvider>
                        <FastTrack />
                        <Optimove />
                      </PixelProvider>
                      <Zendesk
                        zendeskKey={process.env.NEXT_PUBLIC_API_ZENDESK_KEY}
                      />
                    </AppContextProvider>
                  </PromotionProvider>
                </ModalProvider>
                <Recaptcha />
                <ToastContainer enableMultiContainer />
              </GoogleOAuthProvider>
            </SessionProvider>
          </WindowSizeProvider>
        </GoogleTagManagerProvider>
      </BtagProvider>
    </>
  )
}

export default appWithTranslation(MyApp, nextI18nConfig)
