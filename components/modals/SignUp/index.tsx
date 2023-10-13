import { Fragment, useEffect, useState } from 'react'
import { doToast } from 'utils/toastOptions'
import { useSession } from '../../../hooks/useSession'
import LoadingEllipses from '@/components/Loadings/LoadingEllipses'
import { REFER_FRIEND_CODE } from 'constants/index'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import referFriendApi from 'services/referFriendApi'
import { SignUpForm } from './SignUpForm'
import ValidateCPF from './ValidateCPF'
import { openChat } from '@/components/Zendesk'
import { useModal } from '@/hooks/useModal'
import { useTranslation } from 'next-i18next'
import { useGoogleTagManager } from '@/hooks/useGoogleTagManager'
import { Button } from 'design-system/button'

const FORBIDDEN_MESSAGE =
  'Unfortunately you are logging in from a country that we do not accept bets from. We will not be able to proceed with your registration.'

const SignUp = () => {
  const router = useRouter()
  const { session } = useSession()
  const { handleOpenModalLogin, close } = useModal()
  const { t } = useTranslation(['common'])
  const { setDataLayer } = useGoogleTagManager()

  const [activeStep, setActiveStep] = useState(1)
  const [isAllowedRegistrationLoading, setIsAllowedRegistrationLoading] =
    useState(true)
  const [isAllowedRegistration, setIsAllowedRegistration] = useState(false)
  const [hasGenericError, setHasGenericError] = useState(false)
  const [isReferCodeLoading, setIsReferCodeLoading] = useState(false)

  useEffect(() => {
    setDataLayer({
      event: 'open-signup',
    })
  }, [])

  useEffect(() => {
    async function fetchRegistrationIsAllowed() {
      try {
        await session.call('/user/account#ensureRegistrationIsAllowed')
        setIsAllowedRegistrationLoading(true)
        setIsAllowedRegistration(true)
        setHasGenericError(false)
      } catch (error) {
        if (error?.desc === FORBIDDEN_MESSAGE) {
          setIsAllowedRegistration(false)
        } else {
          setIsAllowedRegistration(false)
          setHasGenericError(true)
        }
      } finally {
        setIsAllowedRegistrationLoading(false)
      }
    }

    fetchRegistrationIsAllowed()
  }, [session])

  useEffect(() => {
    const checkReferCode = async (referCode: string) => {
      setIsReferCodeLoading(true)
      const referCodeResponse = await referFriendApi.check(referCode)

      if (referCodeResponse?.error) {
        setIsReferCodeLoading(false)
        close()
        doToast(t('The referral code provided is invalid.'))
        router.push('/cassino')
        return false
      }
      Cookies.set(REFER_FRIEND_CODE, referCode)
      setIsReferCodeLoading(false)
    }

    const queryString = window.location.search

    const urlParams = new URLSearchParams(queryString)

    const referCode = urlParams.get('r')

    if (referCode) {
      checkReferCode(referCode)
    }
  }, [router])

  const isLoading = isReferCodeLoading || isAllowedRegistrationLoading

  if (isLoading) {
    return <LoadingEllipses />
  }

  return (
    <div className="flex flex-col items-center w-full">
      {isAllowedRegistration && (
        <div className="flex flex-col items-center w-full space-y-5 lg:space-y-8">
          <div className="flex flex-col items-center justify-center">
            <p className="mx-auto text-lg font-semibold leading-5 text-center w-72 text-primary sm:w-96 lg:text-2xl">
              {activeStep === 1
                ? t('Sign up and start betting!')
                : t(
                    'Please fill in the fields below to complete your registration.',
                  )}
            </p>
          </div>

          {activeStep === 1 ? (
            <ValidateCPF setActiveStep={setActiveStep} />
          ) : (
            <SignUpForm />
          )}

          <div className="flex items-center justify-center space-x-2 text-xs">
            <span className="text-textPrimary">
              {t('Do you already have an account?')}
            </span>
            <p
              onClick={() => {
                close()
                handleOpenModalLogin()
              }}
              className="cursor-pointer text-primary hover:text-primaryHover"
            >
              {t('Enter')}
            </p>
          </div>
        </div>
      )}

      {!isAllowedRegistrationLoading && !isAllowedRegistration && (
        <Fragment>
          <div className="flex flex-col items-center justify-center">
            <h2 className="my-2 text-lg font-bold text-center text-primary lg:text-2xl">
              {t('Sorry, registration is not available at the moment')}
            </h2>
            <p className="mb-6 text-center text-neutral-10 lg:text-lg">
              {hasGenericError ? (
                <Button onClick={openChat} className="w-full">
                  {t('Call the support')}
                </Button>
              ) : (
                t(
                  'You are trying to register from a country where we do not accept bets. We cannot proceed with your registration.',
                )
              )}
            </p>
          </div>
        </Fragment>
      )}
    </div>
  )
}

export default SignUp
