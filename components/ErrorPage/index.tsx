import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { Button } from 'design-system/button'

export default function ErrorPage() {
  const { t } = useTranslation(['common'])

  return (
    <div className="flex items-center h-full px-6 mx-auto py-52">
      <div className="flex flex-col items-center max-w-sm mx-auto text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-10 h-10 text-primary"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
        <h1 className="mt-3 text-2xl font-semibold text-primary md:text-3xl">
          {t('Page not found')}
        </h1>
        <p className="mt-4 text-gray-200">{t('The page not exist')}</p>
        <div className="mt-6">
          <Link href="/cassino">
            <Button>{t('Back to the beginning')}</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
