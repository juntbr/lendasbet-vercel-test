import { useState, useEffect } from 'react'
import axios from 'axios'
import { Transaction, TransType } from 'types/externalCashier'
import useSWR from 'swr'
import { ArrowUpRightIcon, ArrowDownLeftIcon } from '@heroicons/react/20/solid'
import { HistoryDataResponseProps, PaginationMetaProps } from './types'
import { useAuth } from '@/hooks/useAuth'
import LoadingSpinner from '@/components/Loadings/LoadingSpinner'
import Pagination from '@/components/Pagination'
import formatMoney from 'utils/formatMoney'
import dayjs from 'dayjs'
import { useTranslation } from 'next-i18next'
import { Button } from 'design-system/button'

const defaultMeta = {
  total: 0,
  perPage: 0,
  totalPages: 0,
  offset: 0,
}

export const FinancialHistory = () => {
  const { t } = useTranslation(['common'])
  const [page, setPage] = useState(0)
  const [paginationMeta, setPaginationMeta] =
    useState<PaginationMetaProps>(defaultMeta)
  const [filter, setFilter] = useState<TransType | 'ALL'>('ALL')

  const { sessionId } = useAuth()

  const { data, isValidating, isLoading } = useSWR<{
    data: HistoryDataResponseProps
  }>(
    [
      '/api/payments/history',
      {
        method: 'POST',
        data: {
          sessionId,
          pageSize: 10,
          pageIndex: page,
          transactionType: filter,
        },
      },
    ],
    ([url, config]) => axios(url, config),
  )

  const financialHistory = data?.data?.data ? data?.data?.data : []

  const paginationProps = {
    page,
    setPage,
    paginationMeta,
  }

  const handleFilterPage = (filter: TransType | 'ALL') => {
    setFilter(filter)
    setPage(0)
  }

  useEffect(() => {
    if (data?.data) {
      setPaginationMeta(data?.data?.meta ?? defaultMeta)
    }
  }, [data])

  return (
    <div className="w-full divide-y divide-borderColor">
      <div>
        <h2 className="mb-4 text-xl font-bold text-primary">
          {t('Financial History')}
        </h2>
        <div className="flex justify-start w-full gap-3 mb-4">
          <div className="relative flex justify-center w-full p-1 space-x-3 rounded-full">
            <Button
              onClick={() => handleFilterPage('ALL')}
              variant={filter === 'ALL' ? 'primary' : 'outline'}
              className="w-full !rounded-full"
            >
              {t('All transactions')}
            </Button>

            <Button
              onClick={() => handleFilterPage(TransType.Deposit)}
              variant={filter === TransType.Deposit ? 'primary' : 'outline'}
              className="w-full !rounded-full"
            >
              {t('Make a deposit')}
            </Button>

            <Button
              onClick={() => handleFilterPage(TransType.Withdraw)}
              variant={filter === TransType.Withdraw ? 'primary' : 'outline'}
              className="w-full !rounded-full"
            >
              {t('Withdrawal')}
            </Button>
          </div>
        </div>
      </div>
      <div className="relative w-full overflow-x-auto">
        {isValidating || isLoading ? (
          <div className="flex justify-center w-full p-10">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <table className="w-full text-sm text-left border-separate border-spacing-y-2">
              <thead className="text-textPrimary">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    {t('Movimentations')}
                  </th>
                  <th scope="col" className="px-6 py-3">
                    {t('Value')}
                  </th>
                  <th scope="col" className="px-6 py-3">
                    {t('Data')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {financialHistory.map((history: Transaction) => (
                  <tr key={history.id} className="bg-background">
                    <td
                      scope="row"
                      className="px-6 py-2 font-medium text-white whitespace-nowrap rounded-l-lb"
                    >
                      <div className="flex items-center gap-3">
                        {history.transType === TransType.Withdraw ? (
                          <ArrowUpRightIcon className="w-5 h-5 text-red-500" />
                        ) : (
                          <ArrowDownLeftIcon className="w-5 h-5 text-primary" />
                        )}
                        {history.transType === TransType.Withdraw
                          ? t('Withdrawal')
                          : t('Make a deposit')}
                        {history.transactionReference.includes(
                          'REFER_FRIEND_DEPOSIT',
                        ) && ` ${t('friend referral deposit')}`}
                      </div>
                    </td>
                    <td className="px-6 py-2 text-white">
                      {formatMoney(history.debitAmount)}
                    </td>
                    <td className="px-6 py-2 text-white">
                      {dayjs(history.created, 'YYYY-MM-DD HH:mm:ss').format(
                        'DD/MM/YYYY',
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination {...paginationProps} />
          </>
        )}
      </div>
    </div>
  )
}
