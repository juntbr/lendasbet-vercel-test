import { useContext } from 'react'
import { useAuth } from 'hooks/useAuth'
import { AppContext } from 'contexts/context'

import ChangePassword from './ChangePassword'
import Avatar from '@/components/Account/Avatar'
import PersonalInfo from './PersonalInfo'
import { useTranslation } from 'next-i18next'
import { Button } from 'design-system/button'

export default function Profile() {
  const { t } = useTranslation(['common'])

  const { handleLogout } = useAuth()

  const { profileOption, setProfileOption, isGmailSignup } =
    useContext(AppContext)

  return (
    <div className="grid w-full h-full grid-cols-4 gap-4 divide-x divide-borderColor">
      <div className="flex flex-col col-span-1 space-y-4">
        <Avatar />
        <div className="flex flex-col items-center justify-center w-full space-y-3">
          <Button
            variant={profileOption === 1 ? 'primary' : 'tertiary'}
            onClick={() => setProfileOption(1)}
            className="w-full"
          >
            {t('My data')}
          </Button>

          {!isGmailSignup && (
            <Button
              variant={profileOption === 2 ? 'primary' : 'tertiary'}
              onClick={() => setProfileOption(2)}
              className="w-full"
            >
              {t('Change password')}
            </Button>
          )}

          <Button className="w-full" variant="outline" onClick={handleLogout}>
            {t('Logout')}
          </Button>
        </div>
      </div>

      <div className="col-span-3 pl-4">
        {profileOption === 1 ? (
          <PersonalInfo />
        ) : profileOption === 2 ? (
          <ChangePassword />
        ) : null}
      </div>
    </div>
  )
}
