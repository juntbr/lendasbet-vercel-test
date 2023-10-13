import { AppContext } from 'contexts/context'
import { useContext } from 'react'

export default function Avatar() {
  const { account } = useContext(AppContext)

  return (
    <h2 className="py-4 space-y-2 text-xl font-bold text-center text-white break-words">
      {account.username}
    </h2>
  )
}
