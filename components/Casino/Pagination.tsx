import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { useTranslation } from 'next-i18next'

interface PaginationParams {
  total: number
  perPage: number
  totalPages: number
  noResults?: string
  page: number
  setPage: (value: number) => void
  isLoading?: boolean
}

function getPagers(totalOfPages: number, maxOfPagers = 6) {
  if (isNaN(totalOfPages) || typeof totalOfPages !== 'number') {
    return []
  }

  if (totalOfPages > maxOfPagers) {
    return [1, 2, 3, -1, totalOfPages - 2, totalOfPages - 1, totalOfPages]
  }

  return Array(totalOfPages)
    .fill(0)
    .map((_, index) => index + 1)
}

export default function Pagination(props: PaginationParams) {
  const { t } = useTranslation(['common'])

  const {
    page,
    setPage,
    total,
    totalPages,
    perPage,
    noResults = 'Sem resultado.',
    isLoading = false,
  } = props

  const start = (page + 1 - 1) * perPage + 1
  let end = total

  if (perPage < total) {
    end = perPage * (page + 1)
    if (end > total) {
      end = total
    }
  }

  function paginationAlgorithm(current, total) {
    const center = [current - 2, current - 1, current, current + 1, current + 2]
    const filteredCenter = center.filter((p) => p > 1 && p < total)
    const includeThreeLeft = current === 5
    const includeThreeRight = current === total - 4
    const includeLeftDots = current > 5
    const includeRightDots = current < total - 4

    if (includeThreeLeft) filteredCenter.unshift(2)
    if (includeThreeRight) filteredCenter.push(total - 1)

    if (includeLeftDots) filteredCenter.unshift('...')
    if (includeRightDots) filteredCenter.push('...')

    return [1, ...filteredCenter, total]
  }

  const pages = paginationAlgorithm(page, totalPages)

  if (totalPages <= 1) {
    return null
  }

  return (
    <div className="relative !mt-8 flex w-full items-center justify-center sm:w-auto sm:justify-between sm:py-3">
      {total > 0 ? (
        <div className="flex flex-col items-start overflow-auto sm:flex-1 sm:flex-row sm:items-center sm:justify-between">
          <div className="hidden sm:inline">
            <p className="text-sm text-neutral-10">
              {t('Showing')} <span className="font-medium">{start}</span>{' '}
              {t('To')} <span className="font-medium">{end}</span> {t('Out of')}{' '}
              <span className="font-medium">{total}</span> {t('Results')}
            </p>
          </div>

          <nav
            className="isolate flex items-center -space-x-px rounded-lb shadow-sm"
            aria-label="Pagination"
          >
            <button
              className="cursor-pointer rounded-l-lg border border-primary bg-transparent px-3 py-1 text-sm font-black text-white transition-all duration-300 ease-in-out hover:border-primary lg:border-2 lg:px-4 lg:text-base"
              onClick={() => setPage(page - 1)}
              disabled={page - 1 < 0}
            >
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            {pages.map((pager, index) => {
              if (pager === '...') {
                return (
                  <span
                    key={pager + '-' + index}
                    className="relative inline-flex select-none items-center border border-primary bg-secondary px-4 py-1 text-sm font-medium text-white lg:border-2"
                  >
                    ...
                  </span>
                )
              }
              const currentPage = page === pager - 1
              const className = currentPage
                ? 'relative items-center px-4 py-1 text-sm font-medium text-white bg-primary border lg:border-2 border-primary hover:text-white focus:z-20 inline-flex'
                : 'relative items-center px-4 py-1 text-sm font-medium text-white bg-secondary border lg:border-2 border-primary hover:bg-primary hover:text-white focus:z-20 inline-flex'
              return (
                <button
                  key={pager + '-' + index}
                  onClick={() => setPage(pager - 1)}
                  className={`${className} flex`}
                >
                  {pager}
                </button>
              )
            })}
            <button
              className="cursor-pointer rounded-r-lg border border-primary bg-transparent px-3 py-1 text-sm font-black text-white transition-all duration-300 ease-in-out hover:border-primary lg:border-2 lg:px-4 lg:text-base"
              onClick={() => setPage(page + 1)}
              disabled={page + 1 >= totalPages}
            >
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
          <div className="mt-2 sm:hidden">
            <p className="text-sm text-neutral-10">
              {t('Showing')} <span className="font-medium">{start}</span>{' '}
              {t('To')} <span className="font-medium">{end}</span> {t('Out of')}{' '}
              <span className="font-medium">{total}</span> {t('Results')}
            </p>
          </div>
        </div>
      ) : (
        isLoading === false && (
          <p className="flex w-full justify-center font-semibold text-neutral-20">
            {noResults}
          </p>
        )
      )}
    </div>
  )
}
