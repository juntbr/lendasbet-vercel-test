import useClientTranslation from '@/hooks/useClientTranslation'
import { useBalance } from 'hooks/useBalance'

export default function Balance() {
  const { t } = useClientTranslation()
  const { realMoney, lockedMoney, withdrawAbleMoney } = useBalance()

  return (
    <div className="flex flex-col w-full p-3 space-y-1 border-2 border-borderColor rounded-lb">
      <div className="flex justify-between w-full">
        <span className="text-white text-start">{t('Available')}:</span>
        <span className="text-textPrimary text-end">{withdrawAbleMoney}</span>
      </div>

      <div className="flex justify-between w-full">
        <span className="text-white text-start">{t('Blocked')}:</span>
        <span className="text-textPrimary text-end">{lockedMoney}</span>
      </div>

      <div className="flex justify-between w-full">
        <span className="text-white text-start">{t('Total')}:</span>
        <span className="text-end text-primary">{realMoney}</span>
      </div>
    </div>
  )
}
