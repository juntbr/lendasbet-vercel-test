import {
  ArrowUturnUpIcon,
  CheckIcon,
  ClockIcon,
  XCircleIcon,
} from '@heroicons/react/20/solid'
import { ReactNode } from 'react'
import { PaymentStatusMessageProps } from './types'

export const PaymentStatusMessage: React.FC<PaymentStatusMessageProps> = ({
  status,
}) => {
  const getStatusValues: Record<
    PaymentStatusMessageProps['status'],
    { icon: ReactNode; title: string; schemaColor: string }
  > = {
    '1': {
      icon: <CheckIcon className="h-[16px] w-[17px] text-primary" />,
      title: 'Feito',
      schemaColor: 'text-primary',
    },
    '2': {
      icon: <XCircleIcon className="h-[16px] w-[17px] text-red-50" />,
      title: 'Falhou',
      schemaColor: 'text-red-50',
    },
    '4': {
      icon: <ClockIcon className="h-[16px] w-[17px] text-yellow-50" />,
      title: 'Pendente',
      schemaColor: 'text-yellow-50',
    },
    '5': {
      icon: <ClockIcon className="h-[16px] w-[17px] text-yellow-50" />,
      title: 'Pendente',
      schemaColor: 'text-yellow-50',
    },
    '6': {
      icon: <XCircleIcon className="h-[16px] w-[17px] text-red-50" />,
      title: 'Cancelado',
      schemaColor: 'text-red-50',
    },
    '8': {
      icon: <XCircleIcon className="h-[16px] w-[17px] text-red-50" />,
      title: 'Cancelado',
      schemaColor: 'text-red-50',
    },
    '9': {
      icon: <XCircleIcon className="h-[16px] w-[17px] text-red-50" />,
      title: 'Cancelado',
      schemaColor: 'text-red-50',
    },
    '10': {
      icon: <ArrowUturnUpIcon className="h-[16px] w-[17px] text-yellow-50" />,
      title: 'Estornado',
      schemaColor: 'text-yellow-50',
    },
    '11': {
      icon: <ClockIcon className="h-[16px] w-[17px] text-yellow-50" />,
      title: 'Notificação Pendente',
      schemaColor: 'text-yellow-50',
    },
    '12': {
      icon: <ClockIcon className="h-[16px] w-[17px] text-yellow-50" />,
      title: 'Notificação Pendente',
      schemaColor: 'text-yellow-50',
    },
  }

  const { icon, schemaColor, title } = getStatusValues[status]

  return (
    <>
      {icon}
      <span className={`${schemaColor}`}>{title}</span>
    </>
  )
}
