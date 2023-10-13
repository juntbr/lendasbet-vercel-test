import { useContext, useEffect, useState } from 'react'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { doToast } from 'utils/toastOptions'
import { CodeContentProps } from './types'
import useSWR from 'swr'
import { useAuth } from '@/hooks/useAuth'
import LoadingSpinner from '@/components/Loadings/LoadingSpinner'
import referFriendApi from 'services/referFriendApi'
import axios from 'axios'
import Cookies from 'js-cookie'
import { REFER_FRIEND_CODE } from '../../../../constants'
import { Input } from '@/components/Input'
import { useTranslation } from 'next-i18next'
import { useBtag } from '@/hooks/useBtag'
import { useGoogleTagManager } from '@/hooks/useGoogleTagManager'
import { AppContext } from 'contexts/context'
import { Button } from 'design-system/button'

export const CodeContent = ({ onClick }: CodeContentProps) => {
  const { t } = useTranslation()
  const { setDataLayer } = useGoogleTagManager()
  const { account } = useContext(AppContext)
  const { userId } = useAuth()
  const [isCreatingReferCode, setIsCreatingReferCode] = useState(false)
  const { data: referCodeData, isLoading } = useSWR(
    'getReferCode',
    () => referFriendApi.getByUserId(userId),
    { refreshInterval: 1000 },
  )

  const referCode = referCodeData?.data?.referCode ?? null

  async function getReferCode() {
    setIsCreatingReferCode(true)
    const usedReferCode = Cookies.get(REFER_FRIEND_CODE) ?? null
    try {
      await axios.post('/api/referfriend', {
        partnerUserId: userId,
        usedReferCode,
      })
      Cookies.remove(REFER_FRIEND_CODE)
      setIsCreatingReferCode(false)
    } catch (e) {
      setIsCreatingReferCode(false)
    }
  }

  useEffect(() => {
    const FULL_NAME = account.firstname + ' ' + account.surname
    setDataLayer({
      event: 'open-referafriend',
      user: {
        id: account.userID,
        name: FULL_NAME,
        email: account.email,
        phone: account.phone,
      },
    })
  }, [])

  useEffect(() => {
    getReferCode()
  }, [userId, referCode])

  const [_, copy] = useCopyToClipboard()

  const { getBtagFromCookie } = useBtag()

  const btag = getBtagFromCookie()

  const addBtagToUrl = () => {
    if (btag === 'undefined') return ''
    return `btag=${btag}&`
  }

  const link = `https://lendasbet.com?${addBtagToUrl()}r=${referCode}`

  const handleCopyValue = () => {
    if (referCode === 'null' || referCode === null) {
      doToast('Código carregando...')
      return
    }

    copy(link)

    const FULL_NAME = account.firstname + ' ' + account.surname
    setDataLayer({
      event: 'copy-referafriend',
      user: {
        id: account.userID,
        name: FULL_NAME,
        email: account.email,
        phone: account.phone,
      },
      link,
    })

    doToast('Link de indicação copiado!')
  }

  const condition = !isLoading && !referCode && !isCreatingReferCode

  if (isLoading || condition) {
    return (
      <div className="h-screen p-10 overflow-hidden lg:h-auto">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="mx-auto mb-5 text-xl font-semibold leading-5 text-center text-primary lg:text-2xl">
        {t('Refer and earn')}
      </h3>
      <div className="flex flex-col items-center justify-center space-y-4">
        <h2 className="text-base font-semibold text-textPrimary">
          {t('Invite friends')}
        </h2>

        <span className="text-sm font-semibold text-red-500">
          {t('Earn until R$15')}
        </span>
        <h3 className="text-sm leading-7 text-center text-textPrimary">
          {t('Received extra money', {
            value: 'R$30,00',
          })}
        </h3>

        <Button variant="secondary" className="w-full" onClick={onClick}>
          {t('How works')}
        </Button>
      </div>

      <hr className="border-borderColor" />

      <div className="flex flex-col items-center justify-center gap-4">
        <h4 className="text-xs font-semibold text-center text-textPrimary lg:text-sm">
          {t('Share your code')}
        </h4>

        <Input
          onClick={handleCopyValue}
          isFullWidth
          type="text"
          readOnly
          value={
            referCode === 'null' || referCode == null
              ? `${t('Loading')} ...`
              : link
          }
        />

        <Button type="submit" className="w-full" onClick={handleCopyValue}>
          {t('Copy link')}
        </Button>
      </div>
    </div>
  )
}
