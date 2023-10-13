import type { Transaction } from 'types/externalCashier'

export interface PaginationMetaProps {
  total: number
  perPage: number
  totalPages: number
  offset: number
}

export interface HistoryDataResponseProps {
  error: boolean
  data: Array<Transaction>
  meta: PaginationMetaProps
}
