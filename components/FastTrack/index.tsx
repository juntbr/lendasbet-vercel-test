import { useAuth } from '@/hooks/useAuth'
import Script from 'next/script'
import { useEffect } from 'react'
import Pusher from './Pusher'
import { useTranslation } from 'next-i18next'

export default function FastTrack() {
  const { t } = useTranslation(['common'])
  const { sessionId } = useAuth()

  useEffect(() => {
    if (!sessionId) return
    // if (!userId) return () => { };
    // if (window.fasttrack) return () => { };
    window.fasttrackbrand = process.env.NEXT_PUBLIC_FAST_TRACK_BRAND
    window.sid = sessionId

    // This is the main configuration object

    // This is the main configuration object
    window.fasttrack = {
      integrationVersion: 1.1,
      autoInit: true,
      locale: 'pt',
      inbox: {
        enable: true,
        badgeId: '#ft-crm-inbox-badge',
        navBarLogo: '/favicon-32x32.png',
        // contactEmail: "support@example.com",
        // supportLink: "mailto:daniel@fasttrack-solutions.com",
        // supportLinkText: "Suporte ao Cliente",
      },
      translations: {
        recieved: t('Received'),
        validUntil: t('Valid until'),
        deleteMessagePrompt: t('Are you sure you want to delete this message?'),
        inboxEmpty: t('Currently, there are no messages in your inbox.'),
        readMore: t('Read More'),
        backToList: t('Back'),
        inboxHeader: t('Inbox'),
        pendingBonusesEmpty: t(
          'Currently, there are no pending bonuses in your account.',
        ),
        pendingBonusesTitle: t('Pending Bonuses'),
        pendingBonusesSubTitle: t('Enjoy these amazing bonuses now!'),
        pendingBonusesExpiresIn: t('Expires in'),
        pendingBonusesExpires: t('Expires'),
        pendingBonusesCTAUnlockText: t('Deposit!'),
        pendingBonusesCTAClaimFallbackText: t('Claim!'),
        pendingBonusesBackButtonText: t('Back'),
        pendingBonusesTermsAndConditionsHeader: t('Terms and Conditions'),
        pendingBonusesBonusUnlockedText: t(
          'Great! Now you can enjoy the offer below',
        ),
        days: 'd',
        hours: 'h',
        minutes: 'min',
      },
    }
    if (window.FastTrackLoader) {
      new window.FastTrackLoader()
    }
  }, [sessionId])

  return (
    <>
      <Script
        id="ft-load-script"
        async
        onLoad={() => {
          // console.log("LOG: fasttrack loaded", window.FastTrackLoader);
          if (window.FastTrackLoader) {
            new window.FastTrackLoader()
          }
        }}
        src="https://crm-lib.fasttrack-solutions.com/loader/fasttrack-crm.js"
      ></Script>
      <Pusher />
    </>
  )
}
