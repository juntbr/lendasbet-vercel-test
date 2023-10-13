import Balance from '@/components/Balance'
import Avatar from '../Avatar'
import { FinancialHistory } from './FinancialHistory'

export default function ExtractProfile() {
  return (
    <div className="grid w-full h-full grid-cols-4 gap-4 divide-x divide-borderColor">
      <div className="flex flex-col col-span-1 space-y-4">
        <div className="space-y-2">
          <Avatar />
          <Balance />
        </div>
        <div className="grow" />
      </div>
      <div className="col-span-3 pl-4">{<FinancialHistory />}</div>
    </div>
  )
}
