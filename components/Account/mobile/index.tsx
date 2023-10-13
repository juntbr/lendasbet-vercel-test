import useIncompleteProfile from '@/hooks/useIncompleteProfile'
import { useModal } from '@/hooks/useModal'
import { ExclamationCircleIcon } from '@heroicons/react/20/solid'
import { AppContext } from 'contexts/context'
import { useAuth } from 'hooks/useAuth'
import { useContext } from 'react'
import ChangePassword from './ChangePassword'
import MyData from './ProfilePersonal'
import { useTranslation } from 'next-i18next'
import { Button } from 'design-system/button'

export default function MyAccount() {
  const { t } = useTranslation(['common'])
  const { incompleteProfile } = useIncompleteProfile()
  const { close, handleOpenModalExtract } = useModal()
  const { profileOption, setProfileOption, account, isGmailSignup } =
    useContext(AppContext)

  const { handleLogout } = useAuth()

  return (
    <>
      <h2 className="mx-auto mb-5 text-lg font-semibold text-center text-primary lg:text-2xl">
        {t('My Account')}
      </h2>

      <h2 className="w-full my-5 text-lg font-semibold text-center text-white">
        {t('Username')}: {account.username}
      </h2>
      <div className="w-full">
        <div className="flex items-center justify-around w-full space-x-8">
          <Button
            size="small"
            variant={profileOption === 1 ? 'primary' : 'outline'}
            onClick={() => setProfileOption(1)}
            className="w-full"
          >
            {t('My data')}
          </Button>

          <Button
            variant={profileOption === 3 ? 'primary' : 'outline'}
            onClick={handleOpenModalExtract}
            className="w-full"
            size="small"
          >
            {t('Statement')}
          </Button>
        </div>

        {incompleteProfile && (
          <span className="flex items-center p-2 mt-4 space-x-2 font-semibold leading-5 text-white bg-red-500 rounded-lb">
            <ExclamationCircleIcon className="h-auto w-9" />
            <p className="text-start">{t('Fill the data below')}</p>
          </span>
        )}

        <hr className="w-full my-4 border-t border-b border-borderColor" />
        {profileOption === 1 ? <MyData /> : <ChangePassword />}
        <hr className="w-full my-4 border-b border-borderColor" />
        <div className="flex items-center justify-between w-full space-x-8">
          {!isGmailSignup && (
            <Button
              size="small"
              variant={profileOption === 4 ? 'primary' : 'outline'}
              onClick={() => setProfileOption(4)}
            >
              {t('Change password')}
            </Button>
          )}

          <span
            className="text-sm cursor-pointer text-textPrimary"
            onClick={() => {
              handleLogout().then(() => {
                close()
              })
            }}
          >
            {t('Logout')}
          </span>
        </div>
      </div>
    </>
  )
}
