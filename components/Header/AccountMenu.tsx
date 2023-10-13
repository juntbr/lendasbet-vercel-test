import useWindowSize from '@/hooks/UseWindowSize'
import { useAuth } from '@/hooks/useAuth'
import { useBalance } from '@/hooks/useBalance'
import { useModal } from '@/hooks/useModal'
import { useRollover } from '@/hooks/useRollover'
import { Menu, Transition } from '@headlessui/react'
import {
  ArrowLeftOnRectangleIcon,
  ArrowPathIcon,
  BanknotesIcon,
  UserCircleIcon,
} from '@heroicons/react/20/solid'
import { AppContext } from 'contexts/context'
import { useRouter } from 'next/router'
import { Fragment, useContext } from 'react'
import FastTrackNotification from './FastTrackNotification'
import { useTranslation } from 'next-i18next'
import { Button } from 'design-system/button'
import { t } from 'i18next'

export default function AccountMenu() {
  const { handleLogout } = useAuth()
  const {
    bonusBalance,
    userBalance,
    lockedMoney,
    walletMutate,
    loadingBalance,
  } = useBalance()

  const { availableBonusList } = useRollover()
  const {
    handleOpenModalWithdraw,
    handleOpenModalRAF,
    handleOpenModalRollover,
    handleOpenModalExtract,
    handleOpenModalAccount,
  } = useModal()

  const HAVE_ROLLOVER = availableBonusList?.length > 0 && lockedMoney

  const { push } = useRouter()

  const { account, setDynamicUrl, setProfileOption } = useContext(AppContext)
  const { t } = useTranslation(['common'])

  const toProfile = () => {
    if (width >= 1024) {
      push('/account')
      setProfileOption(1)
      return
    }
    handleOpenModalAccount()
  }

  const toExtract = () => {
    if (width >= 1024) {
      push('/account')
      setProfileOption(2)
      return
    }
    handleOpenModalExtract()
  }

  const { width } = useWindowSize()

  const toOpenBets = () => {
    push('/esportes/historico-de-apostas/open')
    setDynamicUrl('historico-de-apostas/open')
  }

  const toResolvedBets = () => {
    push('/esportes/historico-de-apostas')
    setDynamicUrl('historico-de-apostas')
  }

  const BONUS = bonusBalance?.amount > 0

  return (
    <Menu as="div" className="inline-block text-left md:relative">
      {({ open }) => (
        <>
          <Menu.Button className="flex items-center justify-center space-x-2 rounded-lb border border-borderColor bg-secondary p-2 px-3 hover:bg-borderColor">
            <UserCircleIcon className="h-6 w-6 text-textPrimary" />
            <p
              data-open={open}
              className="mt-[3px] text-xs text-white data-[open=true]:text-primary lg:text-sm"
            >
              {userBalance.label}
            </p>
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute -right-1 left-[50%] mt-4 w-80 origin-top-right translate-x-[-50%] rounded-lb border border-borderColor bg-background shadow-lg ring-1 ring-primaryHover focus:outline-none md:left-auto md:transform-none">
              <div className="flex flex-col items-start justify-center space-y-4 px-3 py-4">
                <div className="flex w-full flex-col space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col items-start space-y-1">
                      <span
                        className="w-28 truncate text-xs text-white lg:text-sm"
                        title={account.username}
                      >
                        {account.username}
                      </span>
                      <div className="flex items-center space-x-1">
                        <p className="text-base font-bold leading-3 text-white">
                          {userBalance.label}
                        </p>
                        <ArrowPathIcon
                          onClick={() => {
                            walletMutate()
                          }}
                          className={`${
                            loadingBalance ? 'animate-spin text-primary' : ''
                          } h-4 w-4 cursor-pointer text-white hover:text-primary`}
                        />
                      </div>
                    </div>

                    <Button onClick={handleOpenModalRAF}>
                      {t('Refer and earn')}
                    </Button>
                  </div>
                  <hr className="w-full border border-borderColor" />
                  <div className="flex w-full items-end justify-between">
                    <div className="flex space-x-4">
                      <div className="flex flex-col items-start">
                        <span className="text-xs text-white">{t('Total')}</span>
                        <p className="text-sm font-bold text-white">
                          {userBalance.label}
                        </p>
                      </div>

                      <div className="flex flex-col items-start">
                        <span className="text-xs text-white">{t('Bonus')}</span>
                        <p className="text-sm font-bold text-white">
                          {BONUS ? bonusBalance.label : 'R$ 0,00'}
                        </p>
                      </div>
                    </div>

                    <Button className="w-24" onClick={handleOpenModalWithdraw}>
                      {t('Withdraw')}
                    </Button>
                  </div>
                </div>

                {HAVE_ROLLOVER && (
                  <>
                    <hr className="w-full border border-borderColor" />
                    <Menu.Item>
                      <Button
                        className="w-full"
                        onClick={handleOpenModalRollover}
                      >
                        {t('Active bonuses')}
                      </Button>
                    </Menu.Item>
                  </>
                )}

                <hr className="w-full border border-borderColor" />

                <span className="text-sm text-white">
                  {t('Betting History')}
                </span>

                <div className="!mt-2 flex w-full justify-start space-x-4">
                  <Menu.Item>
                    <Button variant="secondary" onClick={toOpenBets}>
                      {t('Open')}
                    </Button>
                  </Menu.Item>
                  <Menu.Item>
                    <Button variant="secondary" onClick={toResolvedBets}>
                      {t('Resolved')}
                    </Button>
                  </Menu.Item>
                </div>

                <hr className="w-full border border-borderColor" />

                <div className="flex w-full items-center justify-between">
                  <Menu.Item>
                    <button
                      onClick={toProfile}
                      className="flex cursor-pointer flex-col items-center space-y-1 transition-all duration-300 ease-in-out"
                    >
                      <UserCircleIcon className="flex h-auto w-[30px] text-textPrimary lg:w-8" />
                      <p className="text-xs text-white">{t('My Account')}</p>
                    </button>
                  </Menu.Item>

                  <Menu.Item>
                    <button
                      onClick={toExtract}
                      className="flex cursor-pointer flex-col items-center space-y-1 transition-all duration-300 ease-in-out"
                    >
                      <BanknotesIcon className="flex h-auto w-[30px] text-textPrimary lg:w-8" />
                      <p className="text-xs text-white">{t('Statement')}</p>
                    </button>
                  </Menu.Item>

                  <Menu.Item as="div">
                    <FastTrackNotification />
                  </Menu.Item>
                </div>

                <hr className="w-full border border-borderColor" />

                <Button
                  onClick={() => handleLogout()}
                  variant="outline"
                  className="w-full"
                  startIcon={
                    <ArrowLeftOnRectangleIcon className="mb-0.5 h-4 w-4 text-primary" />
                  }
                >
                  {t('Logout')}
                </Button>
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  )
}
