import useSWR from "swr";
import { useAuth } from "../useAuth";
import { playerApiFetch } from "services/PlayerApi";
import { BonusWalletItem, BonusWalletResponse } from "types/player";
import { useMemo } from "react";

export function useRollover() {
  const { userId } = useAuth();

  const { data: bonusWallet } = useSWR<BonusWalletResponse>(
    `/${userId}/bonusWallet`,
    playerApiFetch
  );

  const availableBonusList = useMemo(() => {
    if (bonusWallet) {
      const activeBonusList = bonusWallet?.items?.filter(
        (item) => item.status === "active"
      );
      return activeBonusList as BonusWalletItem[];
    }
  }, [bonusWallet]);

  return {
    availableBonusList,
  };
}
