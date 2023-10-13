export interface RequestResponse<T = any> {
  error: boolean;
  statusCode: number;
  message: string | null;
  data: T;
}

export interface ICreateReferFriend {
  partnerUserId: string;
  usedReferCode?: string;
  token: string;
}

export interface ICreateResponse {
  partnerUserId: string;
  referCode: string;
  usedReferCode: string;
  minimumDeposit: string;
  amountDeposited: string;
  partnerId: string;
}

export enum ReferFriendDepositType {
  GAMMATRIX = "gammatrix"
};

export interface IDepositReferFriend {
  type: ReferFriendDepositType;
  version: string;
  partnerID: string;
  partnerKey: string;
  requestAmount: string;
  requestCurrency: string;
  transactionReference: string;
  userId: string;
  userIp: string;
  token: string;
}

export interface ICheckResponse {
  referCode: string;
}
