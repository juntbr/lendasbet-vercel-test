import { useModal } from '@/hooks/useModal'
import { useEffect, useState } from 'react'
import BonusModal from './BonusModal'

type BonusRule = {
  name: string
  minValue: number
}

const bonusRulesMock: BonusRule[] = [
  { name: 'LB350', minValue: 40 },
  { name: 'LB450', minValue: 60 },
  { name: 'LB3100', minValue: 40 },
  { name: 'TUFU', minValue: 50 },
  { name: 'LIONSFUT', minValue: 20 },
  { name: 'LOKAOPG', minValue: 50 },
  { name: 'KYRABET', minValue: 50 },
  { name: 'MATUTO', minValue: 20 },
  { name: 'OFERTA100', minValue: 40 },
  { name: 'NC20', minValue: 20 },
  { name: 'CASSINO40', minValue: 40 },
  { name: 'CASSINO30', minValue: 30 },
  { name: 'ESPORTE20', minValue: 20 },
  { name: 'GAME30', minValue: 20 },
  { name: 'ESPORTE30', minValue: 30 },
  { name: 'MAIS20', minValue: 20 },
  { name: 'GANHE50', minValue: 50 },
  { name: 'CRASH100', minValue: 100 },
  { name: 'DUPLO20', minValue: 20 },
  { name: 'DOBRA20', minValue: 20 },
  { name: 'ZAP20', minValue: 20 },
  { name: 'CASSINO20', minValue: 20 },
]

export default function useBonusRules() {
  const [bonusRules, setBonusRules] = useState<BonusRule[]>([])
  const { open } = useModal()

  useEffect(() => {
    fetchBonusRules().then((bonusRulesResponse) => {
      setBonusRules(bonusRulesResponse)
    })
  }, [])

  const fetchBonusRules = async (): Promise<BonusRule[]> => {
    // TODO FETCH TO WORDPRESS
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(bonusRulesMock)
      }, 100)
    })
  }

  const getBonusMinValueByName = (bonusName: string): number | undefined => {
    const bonus = bonusRules.find((rule) => rule.name === bonusName)
    return bonus?.minValue
  }

  const openBonusModal = (
    bonusMinValue: number,
    amountToComplete: number,
    values: any,
  ) => {
    open({
      children: (
        <BonusModal
          minValue={bonusMinValue}
          amountToComplete={amountToComplete}
          values={values}
          bonusCode={values.bonusCode.trim()}
        />
      ),
    })
  }

  return { bonusRules, getBonusMinValueByName, openBonusModal }
}
