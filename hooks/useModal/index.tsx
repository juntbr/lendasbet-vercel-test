import { ReactNode, createContext, useContext, useMemo, useState } from 'react'
import MyAccount from '@/components/Account/mobile'
import Extract from '@/components/Account/mobile/Extract'
import { OfferUnloggedModal } from '@/components/Offers/OfferUnloggedModal'
import Deposit from '@/components/Payments/Deposit'
import Withdraw from '@/components/Payments/Withdraw'
import { openChat } from '@/components/Zendesk'
import Consent from '@/components/modals/Consent'
import DynamicTC from '@/components/modals/DynamicTC'
import ForgotPassword from '@/components/modals/ForgotPassword'
import Login from '@/components/modals/Login'
import { ReferFriendModal } from '@/components/modals/ReferFriendModal'
import Rollover from '@/components/modals/Rollover'
import SignUp from '@/components/modals/SignUp'
import { Query } from 'contexts/types'
import Image from 'next/image'
import useWindowSize from '../UseWindowSize'
import { useRouter } from 'next/router'

type ChildrenType = ReactNode | null

type OpenModalProps = {
  hasCloseIcon?: boolean
  image?: ChildrenType
  width?: string
  children: ChildrenType
}

interface ModalContextProps {
  isVisible: boolean
  hasCloseIcon: boolean
  image: ChildrenType
  width?: string
  open: (data: OpenModalProps) => void
  close: () => void
  children: ChildrenType
}

const ModalContext = createContext({} as ModalContextProps)

const ModalProvider = ({ children: providerChildren }: OpenModalProps) => {
  const [currentChildren, setCurrentChildren] = useState<ChildrenType | null>(
    null,
  )
  const [currentHasCloseIcon, setCurrentHasCloseIcon] = useState(true)

  const [currentImage, setCurrentImage] = useState(null)
  const [width, setWidth] = useState('max-w-lg')

  function close() {
    setCurrentChildren(null)
  }

  function open({
    children,
    hasCloseIcon = true,
    image = null,
    width = 'max-w-lg',
  }: OpenModalProps) {
    setCurrentChildren(children)
    setCurrentHasCloseIcon(hasCloseIcon)
    setCurrentImage(image)
    setWidth(width)
  }

  return (
    <ModalContext.Provider
      value={{
        isVisible: Boolean(currentChildren),
        open,
        close,
        hasCloseIcon: currentHasCloseIcon,
        children: currentChildren,
        image: currentImage,
        width,
      }}
    >
      {providerChildren}
    </ModalContext.Provider>
  )
}

function useModal() {
  const { open, close, isVisible, children, hasCloseIcon, image, width } =
    useContext(ModalContext)
  const { width: pageWidth } = useWindowSize()
  const { push } = useRouter()

  const isMobile = useMemo(() => {
    return pageWidth < 640
  }, [pageWidth])

  const BANNER_LOGIN = useMemo(() => {
    return isMobile
      ? '/images/banners/bonus-100-esportes-login-mobile.png'
      : '/images/banners/bonus-100-esportes-login-desktop.png'
  }, [isMobile])

  const BANNER_SIGNUP = useMemo(() => {
    return isMobile
      ? '/images/banners/bonus-100-cassino-login-mobile.png'
      : '/images/banners/bonus-100-cassino-login-desktop.png'
  }, [isMobile])

  function handleOpenModalSignup() {
    open({
      children: <SignUp />,
      hasCloseIcon,
      image: (
        <Image
          src={BANNER_SIGNUP}
          onClick={() => {
            push('/promocoes/1cassino')
            close()
          }}
          width={785}
          height={697}
          data-mobile={isMobile}
          className="h-[697px] w-[585px] cursor-pointer data-[mobile=true]:w-full"
          loader={({ width, quality }) =>
            `${BANNER_SIGNUP}?w=${width}&q=${quality || 75}`
          }
          alt="Banner"
        />
      ),
      width: 'max-w-6xl',
    })
  }

  function handleOpenModalLogin() {
    open({
      children: <Login />,
      image: (
        <Image
          src={BANNER_LOGIN}
          onClick={() => {
            push('/promocoes/1esporte')
            close()
          }}
          width={785}
          height={697}
          data-mobile={isMobile}
          className="h-[697px] w-[585px] cursor-pointer data-[mobile=true]:w-full"
          alt="Banner"
          loader={({ width, quality }) =>
            `${BANNER_LOGIN}?w=${width}&q=${quality || 75}`
          }
        />
      ),
      width: 'max-w-6xl',
    })
  }

  function handleOpenModalForgotPassword() {
    open({
      children: <ForgotPassword />,
      image: (
        <Image
          src={BANNER_LOGIN}
          onClick={() => push('/promocoes/1esporte')}
          width={785}
          height={697}
          data-mobile={isMobile}
          className="h-[697px] w-[585px] cursor-pointer data-[mobile=true]:w-full"
          alt="Banner"
          loader={({ width, quality }) =>
            `${BANNER_LOGIN}?w=${width}&q=${quality || 75}`
          }
        />
      ),
      width: 'max-w-6xl',
    })
  }

  function handleOpenModalDeposit() {
    open({
      children: <Deposit />,
    })
  }

  function handleOpenModalWithdraw() {
    open({
      children: <Withdraw />,
    })
  }

  function handleOpenModalRAF() {
    open({
      children: <ReferFriendModal />,
    })
  }

  function handleOpenModalTC() {
    open({
      children: <DynamicTC />,
    })
  }

  function handleOpenModalConsent() {
    open({
      children: <Consent />,
      hasCloseIcon: false,
    })
  }

  function handleOpenModalOfferNotAllowedUnlogged() {
    open({
      children: <OfferUnloggedModal />,
    })
  }

  function handleOpenModalRollover() {
    open({
      children: <Rollover />,
    })
  }

  function handleOpenModalAccount() {
    open({
      children: <MyAccount />,
    })
  }

  function handleOpenModalExtract() {
    open({
      children: <Extract />,
    })
  }

  function handleQueryModal(query: Query, logged: boolean) {
    if (query.hasOwnProperty('r')) {
      handleOpenModalSignup()
    }

    if (query.hasOwnProperty('om')) {
      const actions: { [key: string]: () => void } = {
        login: () => handleOpenModalLogin(),
        register: () => handleOpenModalSignup(),
        'forgot-password': () => {
          if (!logged) handleOpenModalForgotPassword()
        },
        'terms-and-conditions': () => handleOpenModalTC(),
        'user-consent': () => handleOpenModalConsent(),
        refer: () => {
          if (logged) handleOpenModalRAF()
        },
        deposit: () => {
          if (logged) handleOpenModalDeposit()
        },
        withdraw: () => {
          if (logged) handleOpenModalWithdraw()
        },
        help: () => {
          setTimeout(() => {
            openChat()
          }, 1000)
        },
      }

      const action = actions[query.om]
      if (action) return action()
    }
  }

  return {
    isVisible,
    children,
    hasCloseIcon,
    open,
    close,
    width,
    image,
    handleOpenModalSignup,
    handleOpenModalLogin,
    handleOpenModalForgotPassword,
    handleOpenModalDeposit,
    handleOpenModalWithdraw,
    handleOpenModalRAF,
    handleOpenModalTC,
    handleOpenModalConsent,
    handleOpenModalOfferNotAllowedUnlogged,
    handleQueryModal,
    handleOpenModalRollover,
    handleOpenModalAccount,
    handleOpenModalExtract,
  }
}

export { ModalProvider, useModal }
