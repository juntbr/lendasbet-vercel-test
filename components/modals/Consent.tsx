import { Disclosure } from '@headlessui/react'
import { useEffect, useState } from 'react'

import { ChevronUpIcon } from '@heroicons/react/20/solid'
import { useSession } from 'hooks/useSession'
import Recaptcha from '../Recaptcha'
import PlayerApi from 'services/PlayerApi'
import { doToast } from 'utils/toastOptions'
import { useAuth } from '../../hooks/useAuth'
import {
  ProfileRequest,
  ProfileResponse,
} from '../../interfaces/profile.interface'
import { useModal } from '@/hooks/useModal'
import { Button } from 'design-system/button'

function Consent() {
  const { handleLogout, sessionId } = useAuth()
  const {
    session,
    setUserId,
    setAccount,
    setIsEmailVerified,
    setLogged,
    setRoles,
  } = useSession()

  const { close } = useModal()

  const [approvalTerms, setApprovalTerms] = useState([])

  const handleOnChange = (code) => {
    const filterTerms = approvalTerms.filter((item) => item.code === code)

    const term = filterTerms.length > 0 ? filterTerms[0] : null

    setApprovalTerms((prevState) => {
      return prevState.map((item) => {
        if (term.code === item.code) {
          return { ...item, approved: !item.approved }
        }
        return item
      })
    })
  }

  async function getConsents() {
    const data = await session.call('/user/account#getConsentRequirements', {
      action: 2,
    })
    if (!data) {
      return false
    }
    setApprovalTerms(data.map((consent) => ({ ...consent, approved: false })))
  }

  useEffect(() => {
    getConsents()
  }, [])

  async function doLogin() {
    const autoLogin = await session.call('/user#loginWithCmsSessionID', {
      sessionID: sessionId,
    })

    session
      .call('/user#getSessionInfo')
      .then((sessionInfo) => {
        setUserId(sessionInfo?.userID)
        setRoles(sessionInfo?.roles)
      })
      .catch((error) => {
        // TODO tratar erro ao obter informacoes de sessao
      })

    // adicionar header em playerAPI
    PlayerApi.defaults.headers.common['X-SessionId'] = sessionId

    const response = await session.call<ProfileResponse>(
      '/user/account#getProfile',
      {} as ProfileRequest,
    )
    setAccount(response.fields)
    setIsEmailVerified(autoLogin.isEmailVerified)
    setLogged(true)
  }

  async function accept() {
    // check if all consents are approved
    if (!approvalTerms.every((item) => item.approved === true)) {
      doToast('Por favor, aprove todos os termos para continuar.')
      return false
    }

    const userConsents = {}

    approvalTerms.forEach((item) => {
      userConsents[item.code] = item.approved
    })

    await session.call('/user#setUserConsents', {
      userConsents,
    })

    await doLogin()

    close()
  }

  function reject() {
    handleLogout(false)
    close()
  }

  return (
    <>
      <Recaptcha />
      <h2 className="mb-1 text-2xl font-bold text-neutral-10">
        Você precisa aceitar os termos antes de continuar
      </h2>
      <div className="mx-auto w-full max-w-md rounded-lb bg-white p-2">
        {approvalTerms.map((consent, i) => {
          const defaultOpen = i === 0

          return (
            <Disclosure defaultOpen={defaultOpen} key={consent.code}>
              {({ open }) => (
                <>
                  <Disclosure.Button className="text-md flex w-full justify-between rounded-lb px-4 py-2 text-left font-medium focus:outline-none focus-visible:ring focus-visible:ring-opacity-75">
                    <span>{consent.title}</span>
                    <ChevronUpIcon
                      className={`${
                        open ? 'rotate-180 transform' : ''
                      } text-primary h-5 w-5`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pb-2 text-sm text-gray-700">
                    <p className="pb-2 text-sm text-gray-700">
                      {consent.description}
                    </p>
                    <label className="font-bold" htmlFor={'id-' + consent.code}>
                      Voce concorda com {consent.title}?{' '}
                      <input
                        className="form-checkbox ml-2"
                        type="checkbox"
                        value={consent.code}
                        checked={consent.approved}
                        onChange={() => handleOnChange(consent.code)}
                        id={'id-' + consent.code}
                      ></input>
                    </label>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          )
        })}
      </div>
      <div className="mt-5 flex justify-between p-2">
        <Button variant="tertiary" onClick={reject}>
          Fechar
        </Button>
        <Button variant="secondary" onClick={accept}>
          Salvar
        </Button>
      </div>
    </>
  )
}

export default Consent
