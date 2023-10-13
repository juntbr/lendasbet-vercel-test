export interface DefaultResponse<T> {
  error: boolean;
  data: T;
  status?: number;
}

export type EndpointName =
  | "deposit"
  | "withdraw"
  | "checkdeposittrans"
  | "proceedwithdraw"
  | "rollbackwithdraw"
  | "approvewithdraw"
  | "transactionHistory";

export interface BalanceChange {
  id: number;
  vendor: string;
  type: string;
  amount: number;
  bonusAmount: number;
  IsFirstDeposit: boolean;
}

export interface Balance {
  name: string;
  bonusMoney: number;
  bonusMoneyCurrency: string;
  lockedMoney: number;
  lockedMoneyCurrency: string;
  realMoney: number;
  realMoneyCurrency: string;
  withdrawableMoney: number;
  withdrawableMoneyCurrency: string;
}

export interface Wallet {
  id: number;
  balanceAmount: string;
  bonusAmount: string;
  currency: string;
  displayName: string;
  isBalanceAvailable: string;
  omBonusAmount: string;
}

export enum TransactionType {
  Deposit = "Deposit",
  Withdraw = "Withdraw",
  Transfer = "Transfer",
  User2User = "User2User",
  Vendor2User = "Vendor2User",
  User2Vendor = "User2Vendor",
  WalletCredit = "WalletCredit",
  WalletDebit = "WalletDebit",
  Refund = "Refund",
  Reversal = "Reversal",
}

export enum TransactionStatus {
  Setup = "Setup",
  Success = "Success",
  Failed = "Failed",
  Processing = "Processing",
  Pending = "Pending",
  ProcessingDebit = "ProcessingDebit",
  DebitFailed = "DebitFailed",
  ProcessingCredit = "ProcessingCredit",
  CreditFailed = "CreditFailed",
  Cancelled = "Cancelled",
  RollBack = "RollBack",
  PendingNotification = "PendingNotification",
  PendingApproval = "PendingApproval",
}
