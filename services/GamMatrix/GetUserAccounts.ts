import axios from "axios";
import { getGamMatrixUri } from "./endpoints";

export interface UserAccount {
  balanceAmount: string;
  bonusAmount: string;
  currency: string | null;
  displayName: string;
  id: number;
  isBalanceAvailable: "0" | "1";
  omBonusAmount: string;
}

export interface GetUserAccountsResponse {
  accounts: UserAccount[];
  errorData: {
    errorCode: 0;
    errorDetails: [];
    errorMessage: "";
    logId: 0;
  };
  isNegativeBalance: "0" | "1";
  success: 0 | 1;
  timestamp: string;
  version: string;
}

export async function GetUserAccounts(sessionId: string) {
  try {
    const GAUri = getGamMatrixUri("GetUserAccounts");

    const response = await axios.get<GetUserAccountsResponse>(
      `${GAUri}/${sessionId}`
    );

    return response.data;
  } catch (error) {
    return null;
  }
}
