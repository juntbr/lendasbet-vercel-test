import LoadingSpinner from '@/components/Loadings/LoadingSpinner'
import Pagination from '@/components/Pagination'
import { useModal } from '@/hooks/useModal'
import { XMarkIcon } from '@heroicons/react/20/solid'
import axios from 'axios'
import { AppContext } from 'contexts/context'
import { useAuth } from 'hooks/useAuth'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import useSWR from 'swr'
import { TransType, Transaction } from 'types/externalCashier'
import dayjs from 'utils/dayjs'
import formatMoney from 'utils/formatMoney'
import { Button } from 'design-system/button'

export interface PaginationMeta {
  total: number
  perPage: number
  totalPages: number
  offset: number
}

const defaultMeta = {
  total: 0,
  perPage: 0,
  totalPages: 0,
  offset: 0,
}

interface HistoryResponse {
  error: boolean
  data: Transaction[]
  meta: PaginationMeta
}

export default function Extract() {
  const { t } = useTranslation(['common'])
  const { setProfileOption } = useContext(AppContext)
  const { close } = useModal()
  const [page, setPage] = useState(0)
  const [paginationMeta, setPaginationMeta] =
    useState<PaginationMeta>(defaultMeta)
  const [filter, setFilter] = useState<TransType>(TransType.Deposit)

  const { sessionId } = useAuth()

  const paginationProps = {
    page,
    setPage,
    paginationMeta,
  }

  const { data, isValidating } = useSWR<{ data: HistoryResponse }>(
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

  const handleFilterPage = (newFilter: TransType) => {
    if (filter !== newFilter) {
      setFilter(newFilter)
      setPage(0)
    }
  }

  useEffect(() => {
    if (data?.data) {
      setPaginationMeta(data?.data?.meta ?? defaultMeta)
    }
  }, [data])

  return (
    <>
      <XMarkIcon
        onClick={() => {
          close()
          setProfileOption(1)
        }}
        className="absolute w-6 h-6 text-white cursor-pointer right-2 top-2"
      />
      <h2 className="mx-auto mb-5 text-lg font-semibold leading-5 text-center text-primary lg:text-2xl">
        {t('Statement')}
      </h2>

      <div className="flex items-center justify-center w-full mb-4 space-x-3">
        <Button
          onClick={() => handleFilterPage(TransType.Deposit)}
          variant={filter === TransType.Deposit ? 'primary' : 'outline'}
          className="w-full"
          size="small"
        >
          {t('Make a deposit')}
        </Button>

        <Button
          onClick={() => handleFilterPage(TransType.Withdraw)}
          variant={filter === TransType.Withdraw ? 'primary' : 'outline'}
          size="small"
          className="w-full"
        >
          {t('Withdrawal')}
        </Button>
      </div>

      <div className="mt-6 h-full min-h-[350px] w-full lg:min-h-[450px]">
        {isValidating ? (
          <div className="flex justify-center w-full p-10">
            <LoadingSpinner />
          </div>
        ) : financialHistory.length > 0 ? (
          <div className="flex flex-col max-w-xs mx-auto space-y-2 ">
            <div className="flex justify-between mb-2 font-bold border-b-2 border-borderColor text-primary">
              <p className="text-start">{t('Data')}</p>
              <p className="text-end">{t('Value')}</p>
            </div>
            {financialHistory.map((history: Transaction) => (
              <div
                key={history.id}
                className="flex justify-between text-sm text-white"
              >
                <p className="text-start">
                  {dayjs(history.created, 'YYYY-MM-DD HH:mm:ss').format(
                    'DD/MM/YYYY',
                  )}
                </p>
                <div
                  className={`space-x-2 text-end ${
                    history.transType === TransType.Deposit
                      ? 'text-primary'
                      : 'text-red-500'
                  }`}
                >
                  <span>
                    {history.transType === TransType.Deposit ? '+' : '-'}
                  </span>
                  <span>{formatMoney(history.debitAmount)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-lg font-semibold text-neutral-20">
            {t("You haven't made any deposits or withdrawals yet.")}
          </p>
        )}
      </div>
      <div className="absolute left-0 right-0 w-full bottom-1">
        <Pagination {...paginationProps} />
      </div>
    </>
  )
}
