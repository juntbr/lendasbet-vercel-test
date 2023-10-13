export enum transactionStatus {
  "Success" = 1,
  "Failed" = 2,
  "Pending" = 4,
  "PendingPay4Fun" = 5, // "PendingApproval
  "DebitFailed" = 6,
  "CreditFailed" = 8,
  "Cancelled" = 9,
  "RollBack" = 10,
  "PendingNotification" = 11,
  "PendingApproval" = 12,
}

export enum TransType {
  "Deposit" = "Deposit",
  "Withdraw" = "Withdraw",
}

export type Transaction = {
  created: string;
  creditAccountId: number;
  creditAmount: number;
  creditCurrency: string;
  creditDisplayName: string;
  creditPayItemName: string;
  creditPayItemVendorName: string;
  creditRealAmount: number;
  debitAccountId: number;
  debitAmount: number;
  debitCurrency: string;
  debitDisplayName: string;
  debitPayItemName: string;
  debitPayItemVendorName: string;
  finished: string;
  id: number;
  status: transactionStatus;
  transId: number;
  transTotalFeeAmount: number;
  transType: TransType;
  transactionReference: string;
};
