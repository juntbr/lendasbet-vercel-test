import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { Balance, BalanceChange, Wallet } from 'types/gamMatrix'

import { useAuth } from 'hooks/useAuth'
import { useFetch } from 'hooks/useFetch'
import { BalanceUpdateService, EventResponse } from './balanceUpdateService'
import formatMoney from 'utils/formatMoney'
import { KeyedMutator } from 'swr'
import { useSession } from '../useSession'

interface BasicBalance {
  label: string
  amount: number
}

interface AccountResponse {
  count: number
  total: number
  totalAmount: {
    [key: string]: number
  }
  items: Wallet[]
}

interface BalanceContextValue {
  wallet: Wallet | null
  mainWallet: Balance
  bonusBalance: BasicBalance
  setLiveBalance: (value: BalanceChange) => void
  userBalance: BasicBalance
  lockedMoney: string
  realMoney: string
  withdrawAbleMoney: string
  accountWalletMutate: KeyedMutator<AccountResponse>
  walletMutate: KeyedMutator<{
    items: Balance[]
  }>
  loadingBalance: boolean
}

const BalanceContext = createContext<BalanceContextValue>(null)

export const BalanceProvider = ({ children }) => {
  const { isLogged, userId, sessionId } = useAuth()
  const { fetchWallet } = useSession()

  const {
    data: wallets,
    mutate: walletMutate,
    isValidating: loadingBalance,
  } = fetchWallet()

  const {
    data: accountWallets,
    isLoading,
    mutate: accountWalletMutate,
  } = useFetch<AccountResponse>(
    isLogged
      ? `${process.env.NEXT_PUBLIC_PLAYER_API_URL}/${userId}/account`
      : null,
    {
      params: {
        headers: {
          'X-SessionId': sessionId,
        },
      },
    },
  )

  const [casinoWallet, setCasinoWallet] = useState<Wallet | null>(null)
  const [bonusWallet, setBonusWallet] = useState<Wallet | null>(null)

  const [liveBalance, setLiveBalance] = useState<BalanceChange | null>(null)

  const mainWallet =
    wallets?.items &&
    wallets.items?.length > 0 &&
    wallets.items.find((item) => item.name === 'MainWallet')

  const withdrawAbleMoney = useMemo(() => {
    return mainWallet?.withdrawableMoney > 0
      ? mainWallet.withdrawableMoney.toLocaleString('pt-br', {
          style: 'currency',
          currency: 'BRL',
          maximumFractionDigits: 2,
        })
      : 'R$ 0,00'
  }, [mainWallet])

  const lockedMoney = useMemo(() => {
    return mainWallet ? formatMoney(mainWallet.lockedMoney) : formatMoney(0)
  }, [mainWallet])

  const realMoney = useMemo(() => {
    return mainWallet?.realMoney > 0
      ? formatMoney(mainWallet.realMoney)
      : 'R$ 0,00'
  }, [mainWallet])

  const bonusBalance = useMemo(() => {
    let amount = 0

    if (liveBalance) {
      amount = liveBalance.bonusAmount
    } else if (mainWallet) {
      amount = mainWallet.bonusMoney
    }

    const label = formatMoney(amount, 'BRL')

    return { amount, label }
  }, [liveBalance, mainWallet])

  const userBalance = useMemo(() => {
    const amount = mainWallet?.realMoney ?? liveBalance?.amount ?? 0

    return { amount, label: formatMoney(amount, 'BRL') }
  }, [liveBalance, mainWallet])

  const handleOnMessage = useCallback(
    (event: EventResponse) => {
      const balanceChange = event.data?.body ?? event.data?.balanceChange

      if (balanceChange) {
        if (bonusWallet?.id && balanceChange[bonusWallet.id]?.afterAmount) {
          setLiveBalance((currentLiveBalance) => ({
            ...currentLiveBalance,
            bonusAmount: balanceChange[bonusWallet.id].afterAmount,
          }))
        }

        if (casinoWallet?.id && balanceChange[casinoWallet.id]?.afterAmount) {
          setLiveBalance((currentLiveBalance) => ({
            ...currentLiveBalance,
            amount: balanceChange[casinoWallet.id].afterAmount,
          }))
        }
      }
    },
    [bonusWallet?.id, casinoWallet?.id],
  )

  useEffect(() => {
    if (!isLoading && userId && sessionId && isLogged) {
      if (accountWallets?.items?.length > 0) {
        const currentCasinoWallet = accountWallets.items.find(
          (item) => item.displayName === 'Casino',
        )
        const currentBonusWallet = accountWallets.items.find(
          (item) => item.displayName === 'UBS',
        )

        if (currentCasinoWallet) {
          setCasinoWallet(currentCasinoWallet)
        }

        if (currentBonusWallet) {
          setBonusWallet(currentBonusWallet)
        }
      }

      accountWalletMutate()
      walletMutate()
    }
  }, [accountWallets, isLoading, userId, sessionId, isLogged])

  // gerencia event stream para update de balance
  useEffect(() => {
    if (sessionId && userId) {
      const balanceUpdateService = new BalanceUpdateService({
        userId: Number(userId),
        sessionId,
      })

      balanceUpdateService.onMessage = handleOnMessage

      balanceUpdateService.connect()

      return () => {
        balanceUpdateService.close()
      }
    }
  }, [sessionId, userId, handleOnMessage])

  return (
    <BalanceContext.Provider
      value={{
        wallet: casinoWallet,
        mainWallet,
        setLiveBalance,
        bonusBalance,
        userBalance,
        withdrawAbleMoney,
        lockedMoney,
        realMoney,
        accountWalletMutate,
        walletMutate,
        loadingBalance,
      }}
    >
      {children}
    </BalanceContext.Provider>
  )
}

export function useBalance(): BalanceContextValue {
  const context = useContext(BalanceContext)

  if (!context) {
    throw new Error('useBalance must be used within an BalanceProvider')
  }

  return context
}
