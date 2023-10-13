import { useContext, useEffect } from 'react'
import { AppContext } from 'contexts/context'
import { CodeContent } from './CodeContent'
import { TermsContent } from './TermsContent'

export const ReferFriendModal = () => {
  const { isOnTermsOfService, setIsOnTermsOfService } = useContext(AppContext)

  useEffect(() => setIsOnTermsOfService(false), [])

  return (
    <>
      {isOnTermsOfService ? (
        <TermsContent onCLick={() => setIsOnTermsOfService(false)} />
      ) : (
        <CodeContent onClick={() => setIsOnTermsOfService(true)} />
      )}
    </>
  )
}
