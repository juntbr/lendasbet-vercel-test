import { BonusWalletItem } from 'types/player'
import { useRollover } from '@/hooks/useRollover'
import { useTranslation } from 'next-i18next'

function RolloverBonusItem({ bonusItem }) {
  const bonusRequirement = bonusItem.originalWageringRequirement
  const bonusProgress = bonusItem.fulfilledWR
  const bonusProgressPercentage = (100 * bonusProgress) / bonusRequirement

  return (
    <div className="flex flex-col space-y-2 !py-4">
      <div className="text-center font-bold uppercase text-neutral-10">
        <p>{bonusItem.name}</p>
      </div>
      <ProgressBar progress={bonusProgressPercentage} />
      <div className="flex justify-center space-x-1 text-lg font-bold text-primary">
        <p>{bonusProgress}</p>
        <p>/ {bonusRequirement}</p>
      </div>
    </div>
  )
}

function ProgressBar({ progress }) {
  return (
    <div className="h-4 w-full rounded-full bg-neutral-40">
      <div
        className="h-4 rounded-full bg-primary"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  )
}

export default function Rollover() {
  const { t } = useTranslation()
  const { availableBonusList } = useRollover()

  return (
    <>
      <h2 className="mx-auto mb-5 text-center text-lg font-semibold leading-5 text-primary lg:text-2xl">
        {t('Active bonus')}
      </h2>
      {availableBonusList.map((item: BonusWalletItem) => (
        <RolloverBonusItem key={item.bonusId} bonusItem={item} />
      ))}
    </>
  )
}
