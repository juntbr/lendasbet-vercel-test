import {
  DepositRequest,
  DepositResponseCaship,
  PixType as PixTypeCaship,
  WithdrawRequest,
} from "types/caship";

import { HttpStatusClasses, HttpStatusExtra } from "http-status";
import {
  DepositResponsePay4Fun,
  Pay4FunConfigUrls,
  PixType as PixTypeP4f,
  ScreeningRequestParams,
} from "services/Pay4Fun/types";
import {
  PixType as PixTypePaaG, WithdrawRequestParams,
} from "services/Paag/types";
import { MoneyMatrixDeposit } from "services/MoneyMatrix/types";

export type { WithdrawResponse } from "types/caship";

export type PixType = PixTypeCaship | PixTypeP4f | PixTypePaaG;

export enum OrderStatus {
  PENDING = 1,
  COMPLIANCE = 2,
  SETTLED = 6,
  CANCELED_BY_USER = 3, // canceled_by_the_user
  CANCELED_BY_STARSPAY = 4, // canceled_by_starspay
  RESFUSED_BY_BANK = 5, // refused_by_the_bank
  APPROVED = 7, //
  REJECTED = 8, // rejected
}

export enum GatewayType {
  CASHIP = "CASHIP",
  PAY4FUN = "PAY4FUN",
  PAAG = "PAAG",
}

export interface DepositRequestGateway
  extends DepositRequest,
    Pay4FunConfigUrls,
    MoneyMatrixDeposit {}

export interface DepositParams {
  type: GatewayType;
  params: DepositRequestGateway;
}

export interface WithdrawRequestGateway
  extends WithdrawRequest,
    Pay4FunConfigUrls, WithdrawRequestParams {}

export interface WithdrawParams {
  type: GatewayType;
  params: Partial<
    WithdrawRequestGateway
    | "partner_order_method"
    | "partner_order_group"
    | "partner_withdraw_pwd"
    | "realtime"
  >;
}

export interface ScreeningParams {
  type: GatewayType;
  params: ScreeningRequestParams;
}

export enum TransactionStatus {
  SUCCESS = "SUCCESS",
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
  FAILED = "FAILED",
}
export interface GatewayResponse<T = any> {
  statusCode: string | number | HttpStatusClasses | HttpStatusExtra;
  status: TransactionStatus;
  error: boolean;
  data?: T | null;
  message: string;
}

export type DepositResponse =
  | (DepositResponseCaship & {
      transationId: string;
    })
  | (DepositResponsePay4Fun & {
      transationId: string;
    });
