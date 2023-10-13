/* eslint-disable @next/next/no-img-element */
import Image from 'next/legacy/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

export default function InstitucionalFooter() {
  const { route } = useRouter()
  const { t } = useTranslation(['common'])

  const commonQuestions = [
    {
      title: t('Frequently Asked Questions'),
      link: 'https://suporte.lendasbet.io/hc/pt-br',
    },
    { title: t('Privacy Policy'), link: '/policies/privacy-policy' },
    {
      title: t('Terms and Conditions'),
      link: '/policies/terms-and-conditions',
    },
    {
      title: t('Responsible Gambling'),
      link: '/policies/responsible-gambling',
    },
    { title: t('AML and KYC Policy'), link: '/policies/aml-kyc-policy' },
  ]

  const HAS_SIDEBAR = route.includes('/cassino') || route === '/'

  return (
    <div className="bg-background">
      <div
        className={`mx-auto flex w-full flex-col px-5 py-10 lg:max-w-screen-8xl lg:px-0  ${
          !HAS_SIDEBAR && 'xl:max-w-[90rem]'
        }`}
      >
        <div className={`${HAS_SIDEBAR && 'lg:ml-64'} `}>
          <div className="flex flex-col justify-between w-full mb-5 space-y-6 lg:flex-row lg:space-x-9 lg:space-y-0 xl:space-x-0">
            <div className="w-full max-w-md">
              <Image
                src="/images/logo.svg"
                alt="lendas bet logo"
                height={28}
                width={140}
                className="cursor-pointer"
              />
              <p className="mt-3 text-xs text-neutral-40 lg:max-w-2xl lg:text-base">
                {t(
                  "We are a 100% Digital company focused on bringing more entertainment and fun to people's daily lives.",
                )}
                <span className="block mt-1 text-neutral-20">
                  {t('Remember: Gamble responsibly!')}
                </span>
              </p>
            </div>

            <div className="flex justify-between w-full">
              <ul className="flex flex-col mb-3 space-y-3 sm:mb-0 sm:space-y-2 lg:mx-auto">
                {commonQuestions.map((link, i) => (
                  <li key={i}>
                    <Link
                      href={link.link}
                      passHref
                      target="_blank"
                      className="text-xs transition-colors duration-300 text-neutral-40 hover:underline sm:text-sm"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col space-y-4">
                <div className="flex flex-col items-start">
                  <span className="hidden mb-1 text-xs text-neutral-40 lg:block lg:text-base">
                    {t('Follow us on social media.')}
                  </span>
                  <div className="flex items-center mt-1 space-x-4">
                    <Link
                      href="https://www.facebook.com/profile.php?id=100087464726176"
                      passHref
                      target="_blank"
                      className="transition-colors duration-300 text-neutral-20 hover:text-neutral-20"
                      rel="noreferrer"
                    >
                      <Image
                        src="/icons/facebook.svg"
                        className="w-20 h-20"
                        width={20}
                        height={20}
                        alt="social"
                      />
                    </Link>
                    <Link
                      href="https://www.instagram.com/lendasbet/"
                      passHref
                      target="_blank"
                      className="transition-colors duration-300 text-neutral-20 hover:text-neutral-20"
                      rel="noreferrer"
                    >
                      <Image
                        src="/icons/instagram.svg"
                        className="w-20 h-20"
                        width={20}
                        height={20}
                        alt="social"
                      />
                    </Link>
                    <Link
                      href="https://twitter.com/LendasBet"
                      passHref
                      target="_blank"
                      className="transition-colors duration-300 text-neutral-20 hover:text-neutral-20"
                      rel="noreferrer"
                    >
                      <Image
                        src="/icons/twitter.svg"
                        className="w-20 h-20"
                        width={20}
                        height={20}
                        alt="social"
                      />
                    </Link>
                  </div>
                </div>

                <div className="flex flex-col text-xs sm:hidden lg:text-base">
                  <p className="text-neutral-40">{t('Support:')}</p>
                  <Link
                    href="mailto:suporte@lendasbet.com"
                    passHref
                    aria-label={t('Email to contact support')}
                    title={t('Email to contact support')}
                    className="text-neutral-40"
                  >
                    suporte@lendasbet.com
                  </Link>
                </div>

                <div className="flex flex-col items-start">
                  <span className="mb-1 text-xs text-neutral-40 lg:text-base">
                    {t('Payment Method')}
                  </span>
                  <Image
                    src="/images/logo-pix.svg"
                    height={28}
                    width={70}
                    className="w-8 h-8"
                    alt="pix"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse justify-between py-5 space-y-4 border-t border-borderColor pb-14 lg:pb-0">
            <Link
              href="https://licensing.gaming-curacao.com/validator/?lh=ae68d85b475e135161bf511091470560"
              target="_blank"
              className="flex justify-center pt-8"
            >
              <img
                src="https://licensing.gaming-curacao.com/validator/images/Gaming-Curacao-ClickToVerify.png"
                alt={t('Valid license for verification')}
              />
            </Link>
            <div className="flex justify-between">
              <p className="text-xs text-neutral-40 lg:text-base">
                {t('licenseText')}
              </p>
            </div>
            <p className="text-xs text-neutral-40 lg:text-base">
              {t('© Copyright 2022 Lendas Bet. All rights reserved.')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
