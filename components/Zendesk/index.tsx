import Script from 'next/script'

import { ZendeskParams } from './types'
import { useGoogleTagManager } from '@/hooks/useGoogleTagManager'
import { useContext, useEffect, useState } from 'react'
import { AppContext } from 'contexts/context'
import { zendeskAction } from './utils'

export { openChat, closeChat, zendeskAction } from './utils'

export function Zendesk(params: ZendeskParams) {
  const { zendeskKey, lang = 'pt-br' } = params
  const { setDataLayer } = useGoogleTagManager()
  const { account } = useContext(AppContext)
  const [zE, setZE] = useState(null)

  useEffect(()=>{
    zendeskAction("messenger:on", "open", () => {
      if(account) openSupportDataLayer()
    })    
  },[zE, account])

  const openSupportDataLayer = () => {
    const EVENT_NAME = 'open-support'
    const FULL_NAME = account.firstname + ' ' + account.surname
    setDataLayer({
      event: EVENT_NAME,
      user: {
        id: account.userID,
        name: FULL_NAME,
        email: account.email,
        phone: account.phone,
      },
    })
  }

  return (
    <>
      <Script
        id="ze-snippet"
        src={`https://static.zdassets.com/ekr/snippet.js?key=${zendeskKey}`}
        defer
        onLoad={() => {
          zendeskAction('messenger:set', 'locale', lang)
          setZE(window?.zE)
        }}
      />
    </>
  )
}
