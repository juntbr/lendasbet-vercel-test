import { useRouter } from 'next/router'
import { useModal } from '@/hooks/useModal'
import { openChat } from '../Zendesk'
import { Button } from 'design-system/button'

const DEPOSIT = 'deposit'
const WITHDRAW = 'withdraw'

export default function SuccessOrError({
  status,
  successStatus,
  message,
  type,
}) {
  const { push } = useRouter()
  const { handleOpenModalDeposit, handleOpenModalWithdraw } = useModal()

  if (type === DEPOSIT && status === successStatus) {
    return (
      <div className="relative flex flex-col items-center justify-start w-full h-full pt-10 space-y-4 sm:justify-center sm:pt-0">
        <svg
          width="55"
          height="55"
          viewBox="0 0 17 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="0.5" width="16" height="16" rx="8" fill="#1EC355" />
          <path
            d="M5 8L7.14645 10.1464C7.34171 10.3417 7.65829 10.3417 7.85355 10.1464L12 6"
            stroke="#F7F7F7"
            strokeLinecap="round"
          />
        </svg>
        <span className="text-xl font-bold text-center text-primary">
          {message}
        </span>
        <p className="text-center text-white w-72">
          Agora é só aproveitar a diversão! Boa sorte nas apostas!
        </p>
        <div className="!mt-10 flex flex-col space-y-4 sm:flex-row sm:space-x-5 sm:space-y-0">
          <Button onClick={() => push('/cassino')} className="w-52">
            Jogar no cassino
          </Button>
          <Button onClick={() => push('/esportes')} className="w-52">
            Apostar em esportes
          </Button>
        </div>
      </div>
    )
  }

  if (type === DEPOSIT && status !== successStatus) {
    return (
      <div className="relative flex flex-col items-center justify-start w-full h-full pt-10 space-y-4 sm:justify-center sm:pt-0">
        <svg
          width="55"
          height="55"
          viewBox="0 0 17 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="0.5" width="16" height="16" rx="8" fill="#FF3D3D" />
          <path d="M5 5L12 11" stroke="#F7F7F7" strokeLinecap="round" />
          <path
            d="M12 5.00012L5 11.0001"
            stroke="#F7F7F7"
            strokeLinecap="round"
          />
        </svg>
        <span className="text-xl font-bold text-center text-red-500">
          {message}
        </span>
        <div className="!mt-10 flex flex-col space-y-4 sm:flex-row sm:space-x-5 sm:space-y-0">
          <Button
            onClick={handleOpenModalDeposit}
            variant="secondary"
            className="w-52"
          >
            Tentar novamente
          </Button>
          <Button onClick={openChat} variant="secondary" className="w-52">
            Chamar o suporte
          </Button>
        </div>
      </div>
    )
  }

  if (type === WITHDRAW && status === successStatus) {
    return (
      <div className="relative flex flex-col items-center justify-start w-full h-full pt-10 space-y-4 sm:justify-center sm:pt-0">
        <svg
          width="55"
          height="55"
          viewBox="0 0 17 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="0.5" width="16" height="16" rx="8" fill="#1EC355" />
          <path
            d="M5 8L7.14645 10.1464C7.34171 10.3417 7.65829 10.3417 7.85355 10.1464L12 6"
            stroke="#F7F7F7"
            strokeLinecap="round"
          />
        </svg>
        <span className="text-xl font-bold text-center text-primary">
          {message}
        </span>
        <div className="!mt-10 flex flex-col space-y-4 sm:flex-row sm:space-x-5 sm:space-y-0">
          <Button
            onClick={() => push('/cassino')}
            variant="primary"
            className="w-52"
          >
            Jogar no cassino
          </Button>
          <Button
            onClick={() => push('/esportes')}
            variant="primary"
            className="w-52"
          >
            Apostar em esportes
          </Button>
        </div>
      </div>
    )
  }

  if (type === WITHDRAW && status !== successStatus) {
    return (
      <div className="relative flex flex-col items-center justify-start w-full h-full pt-10 space-y-4 sm:justify-center sm:pt-0">
        <svg
          width="55"
          height="55"
          viewBox="0 0 17 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="0.5" width="16" height="16" rx="8" fill="#FF3D3D" />
          <path d="M5 5L12 11" stroke="#F7F7F7" strokeLinecap="round" />
          <path
            d="M12 5.00012L5 11.0001"
            stroke="#F7F7F7"
            strokeLinecap="round"
          />
        </svg>
        <span className="text-xl font-bold text-center text-red-500">
          {message}
        </span>
        <div className="!mt-10 flex flex-col space-y-4 sm:flex-row sm:space-x-5 sm:space-y-0">
          <Button
            onClick={handleOpenModalWithdraw}
            variant="secondary"
            className="w-52"
          >
            Tentar novamente
          </Button>
          <Button onClick={openChat} variant="secondary" className="w-52">
            Chamar o suporte
          </Button>
        </div>
      </div>
    )
  }
}
