import { useState, useEffect } from 'react'
import { useTranslation } from 'next-i18next'

interface RedirectScreenProps {
  redirectTo?: string
}

export const RedirectScreen = (props: RedirectScreenProps) => {
  const { t } = useTranslation(['common'])
  const [count, setCount] = useState(5)

  useEffect(() => {
    const counterId = setInterval(() => {
      setCount((currentCount) => {
        if (currentCount > 0) {
          return currentCount - 1
        }

        return 0
      })
    }, 1000)

    return () => clearInterval(counterId)
  }, [])

  if (count === 0) {
    if (props.redirectTo) {
      window.location.replace(props.redirectTo)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-4">
      <h1 className="font-medium text-white sm:text-xl">
        {t('You are being redirected to the payment page at')}
      </h1>
      <span className="text-3xl font-bold text-white">{count}</span>
    </div>
  )
}
