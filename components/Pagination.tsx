import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/20/solid'
import { PaginationMetaProps } from './Account/Extract/FinancialHistory/types'
import { useTranslation } from 'next-i18next'

interface PaginationParams {
  page: number
  paginationMeta: PaginationMetaProps
  setPage: (value: number) => void
  noResults?: string
}

export default function Pagination(props: PaginationParams) {
  const { t } = useTranslation(['common'])
  const {
    page,
    setPage,
    paginationMeta,
    noResults = t("You haven't made any deposits or withdrawals yet."),
  } = props
  const { total, totalPages } = paginationMeta

  let end = total

  if (paginationMeta?.perPage < total) {
    end = paginationMeta?.perPage * (page + 1)
    if (end > total) {
      end = total
    }
  }

  return (
    <div className="flex items-center justify-center py-3 sm:justify-between sm:px-6">
      {total > 0 ? (
        <div className="flex flex-col items-start sm:flex-1 sm:flex-row sm:items-center sm:justify-between">
          <div className="hidden sm:inline">
            <p className="text-sm text-textPrimary">
              {t('Showing')} <span className="font-medium">{end}</span>{' '}
              {t('To')} <span className="font-medium">{total}</span>{' '}
              {t('Results')}
            </p>
          </div>

          <nav className="flex items-center space-x-1" aria-label="Pagination">
            <ArrowLeftIcon
              onClick={() => {
                if (!(page - 1 < 0)) {
                  setPage(page - 1)
                }
              }}
              data-hidden={page === 0}
              className="h-auto w-5 cursor-pointer text-primary transition-all duration-300 ease-in-out data-[hidden=true]:hidden hover:text-primaryHover"
            />
            {Array(totalPages)
              .fill(0)
              .slice(0, 6)
              .map((_, index) => {
                const currentPage = page === index
                const className = currentPage
                  ? 'relative rounded-lb items-center px-3 py-1 text-sm font-medium text-background bg-primary border border-primary'
                  : 'relative rounded-lb items-center px-3 py-1 text-sm font-medium text-white border border-textPrimary hover:bg-primaryHover hover:text-background'
                return (
                  <button
                    key={index}
                    onClick={() => setPage(index)}
                    className={`${className} hidden sm:flex`}
                  >
                    {index + 1}
                  </button>
                )
              })}

            <div className="lg:hidden">
              <p className="text-xs text-neutral-10">
                {t('Showing')} <span className="font-medium">{end}</span>{' '}
                {t('To')} <span className="font-medium">{total}</span>{' '}
                {t('Results')}
              </p>
            </div>

            <ArrowRightIcon
              onClick={() => {
                if (page + 1 < totalPages) {
                  return setPage(page + 1)
                } else {
                  return setPage(0)
                }
              }}
              className="w-5 h-auto transition-all duration-300 ease-in-out cursor-pointer hover:text-primary text-primary"
            />
          </nav>
        </div>
      ) : (
        <p className="justify-center hidden w-full font-semibold text-neutral-20 sm:flex">
          {noResults}
        </p>
      )}
    </div>
  )
}
