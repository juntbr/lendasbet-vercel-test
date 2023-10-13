import * as Sentry from '@sentry/browser'
import { useSession } from 'hooks/useSession'
import { ProfileRequest, ProfileResponse } from 'interfaces/profile.interface'
import isEqual from 'lodash/isEqual'
import { createContext, useContext, useEffect, useState } from 'react'
import isNotEmpty from 'utils/checkForEmpty'
import dayjs from 'utils/dayjs'
import { doToast } from 'utils/toastOptions'
import useWindowSize from '../UseWindowSize'
import { SessionInfoResponse } from '../useAuth/types'
import { CountryRegionsResponse, Region } from './states'
import { useModal } from '../useModal'

const ProfileDataContext = createContext<{
  regions: Region[]
  save: (data: object) => void
  profileData: any
}>(undefined)

function validatePhoneNumbers(profileData) {
  const params = profileData

  if (isNotEmpty(params.mobile) && !isNotEmpty(params.phone)) {
    params.phone = params.mobile
  } else if (!isNotEmpty(params.mobile) && isNotEmpty(params.phone)) {
    params.mobile = params.phone
  }

  return params
}

export default function ProfileDataProvider({ children }) {
  const { handleOpenModalDeposit, close } = useModal()

  const { session, account, setAccount, setRoles } = useSession()
  const [regions, setRegions] = useState<Region[]>([])
  const [profileData, setProfileData] = useState<any>({})
  const { isMobile } = useWindowSize()

  useEffect(() => setProfileData(account), [account])

  const submitData = async () => {
    const params = validatePhoneNumbers(profileData)
    params.title = 'Mr.'

    localStorage.setItem(
      'consentsProfile',
      JSON.stringify({
        acceptNewsEmail: params.acceptNewsEmail,
        acceptSMSOffer: params.acceptSMSOffer,
      }),
    )

    try {
      await session.call('/user/account#updateProfile', params)
      doToast('Perfil atualizado!')
      close()
      isMobile && handleOpenModalDeposit()
    } catch (e) {
      Sentry.captureException(e, {
        extra: {
          message:
            'Tivemos um erro na atualização do perfil, tente novamente mais tarde.',
        },
      })
      doToast(
        'Tivemos um erro na atualização do perfil, tente novamente mais tarde.',
      )
    }

    const sessionInfo = await session.call<SessionInfoResponse>(
      '/user#getSessionInfo',
    )
    setRoles(sessionInfo?.roles)

    const response = await session.call<ProfileResponse>(
      '/user/account#getProfile',
      {} as ProfileRequest,
    )
    setAccount(response.fields)
  }

  useEffect(() => {
    if (Object.keys(profileData).length > 0 && !isEqual(profileData, account))
      submitData()
  }, [profileData])

  const save = (data: any) => {
    const name = data.name
    const firstName = name?.split(' ')[0]
    const surname = name?.substring(firstName.length).trim()

    const params = {}

    if (isNotEmpty(data.title)) {
      params.title = data.title
    } else if (isNotEmpty(profileData.title)) {
      params.title = profileData.title
    } else {
      params.title = account.title
    }

    switch (params.title) {
      case 'Mr':
        params.gender = 'M'
        break
      case 'Mrs':
        params.gender = 'F'
        break
    }

    if (isNotEmpty(data.gender)) {
      params.gender = data.gender
    } else if (isNotEmpty(profileData.gender)) {
      params.gender = profileData.gender
    } else {
      params.gender = account.gender
    }

    if (isNotEmpty(data.cpf)) {
      const value = data.cpf.replace(/\D/g, '')
      params.personalID = value
    } else if (isNotEmpty(profileData.cpf)) {
      params.personalID = profileData.cpf
    } else {
      params.personalID = account.personalID
    }

    if (isNotEmpty(firstName)) {
      params.firstname = firstName
    } else if (isNotEmpty(profileData.firstname)) {
      params.firstname = profileData.firstname
    } else {
      params.firstname = account.firstname
    }

    if (isNotEmpty(surname)) {
      params.surname = surname
    } else if (isNotEmpty(profileData.surname)) {
      params.surname = profileData.surname
    } else {
      params.surname = account.surname
    }

    if (isNotEmpty(data.birthDate)) {
      let birthDate = data.birthDate.replace(/\D/g, '')
      birthDate = dayjs(birthDate, 'DDMMYYYY').format('YYYY-MM-DD')
      params.birthDate = birthDate
    } else if (isNotEmpty(profileData.birthDate)) {
      params.birthDate = profileData.birthDate
    } else {
      params.birthDate = account.birthDate
    }

    if (isNotEmpty(data.email)) {
      params.email = data.email
    } else if (isNotEmpty(profileData.email)) {
      params.email = profileData.email
    } else {
      params.email = account.email
    }

    if (isNotEmpty(data.mobilePrefix)) {
      params.mobilePrefix = data.mobilePrefix
    } else {
      params.mobilePrefix = '+55'
    }

    if (isNotEmpty(data.mobile)) {
      const mobile = data.mobile.replace(/\D/g, '')
      params.mobile = mobile
    } else if (isNotEmpty(profileData.mobile)) {
      params.mobile = profileData.mobile
    } else {
      params.mobile = account.mobile
    }

    if (isNotEmpty(data.phonePrefix)) {
      params.phonePrefix = data.phonePrefix
    } else {
      params.phonePrefix = '+55'
    }

    if (isNotEmpty(data.phone)) {
      const phone = data.phone.replace(/\D/g, '')
      params.phone = phone
    } else if (isNotEmpty(profileData.phone)) {
      params.phone = profileData.phone
    } else {
      params.phone = account.phone
    }

    if (isNotEmpty(data.postalCode)) {
      params.postalCode = data.postalCode
    } else if (isNotEmpty(profileData.postalCode)) {
      params.postalCode = profileData.postalCode
    } else {
      params.postalCode = account.postalCode
    }

    if (isNotEmpty(data.address1)) {
      const address = data.address1
      params.address1 = address
    } else if (isNotEmpty(profileData.address1)) {
      params.address1 = profileData.address1
    } else {
      params.address1 = account.address1
    }

    if (isNotEmpty(data.address2)) {
      params.address2 = data.address2
    } else if (isNotEmpty(profileData.address2)) {
      params.address2 = profileData.address2
    } else {
      params.address2 = account.address2
    }

    if (isNotEmpty(data.city)) {
      params.city = data.city
    } else if (isNotEmpty(profileData.city)) {
      params.city = profileData.city
    } else {
      params.city = account.city
    }

    if (isNotEmpty(data.region)) {
      params.region = data.region
    } else if (isNotEmpty(profileData.region)) {
      params.region = profileData.region
    } else {
      params.region = account.region
    }

    if (isNotEmpty(data.country)) {
      params.country = data.country
    } else if (isNotEmpty(profileData.country)) {
      params.country = profileData.country
    } else {
      params.country = account.country
    }

    params.userConsents = {}

    if (typeof data.newsEmail !== 'undefined') {
      params.userConsents.emailmarketing = data.newsEmail
    } else {
      params.userConsents.emailmarketing = account.acceptNewsEmail
    }
    if (typeof data.newsSMS !== 'undefined') {
      params.userConsents.sms = data.newsSMS
    } else {
      params.userConsents.sms = account.acceptSMSOffer
    }

    if (Object.keys(params.userConsents).length === 0) {
      params.userConsents = null
    }

    params.language = 'pt-br'

    setProfileData(params)
  }

  async function fetchCountries() {
    try {
      const res: CountryRegionsResponse = await session.call(
        '/user/account#getCountries',
        { expectRegions: true, filterByCountry: 'BR' },
      )
      if (res.countries?.length > 0) {
        // 27 length
        setRegions(res.countries[0].regions ?? [])
      }
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    fetchCountries()
  }, [])

  return (
    <ProfileDataContext.Provider
      value={{
        regions,
        save,
        profileData,
      }}
    >
      {children}
    </ProfileDataContext.Provider>
  )
}

export const useProfileData = () => useContext(ProfileDataContext)
