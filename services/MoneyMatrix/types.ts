import { CurrentCode } from "constants/currency";

export type Language = "pt-BR" | "en-US" | "es-ES";

export enum PaymentMethod {
  Boleto = "Boleto",
  BankTransfer = "BankTransfer",
  Pix = "PIX",
}

export interface MoneyMatrixDeposit {
  gamingAccountID?: string;
  bonusCode?: string;
}

export interface WithdrawRequestParams {
  amount: string;
  merchantInvoiceId: string;
  language?: string;
  currency: string;
  confirmationUrl?: string;
  targetCustomerEmail: string;
  targetCustomerMainId: string;
  pixKeyType: string;
  bankCode?: string;
  bankBranch?: string;
  bankAccount?: string;
  bankAccountType?: "SAVING" | "PERSONAL";
}

export interface DepositRequestParams extends MoneyMatrixConfigUrls {
  amount: number | string;
  bonusCode?: string;
  gamingAccountID: string;
  currency: CurrentCode; //ISO 4217
  language?: Language;
}
export interface ScreeningRequestParams extends MoneyMatrixConfigUrls {
  amount: number;
  merchantInvoiceId: string;
  language?: Language;
  currency: string;
  targetCustomerMainId: string;
  targetCustomerEmail: string;
  fullName: string;
  targetCustomerBirthDate: string;
  targetCustomerPhoneNumberCountryCode: string;
  targetCustomerPhoneNumberAreaCode: string;
  targetCustomerPhoneNumber: string;
  merchantLogo?: string;
  layoutColor?: string;
}

export type BasicResponse = {
  code: number;
  message: string;
  url?: string;
};

export type DepositResponse = BasicResponse;
export type ScreeningResponse = BasicResponse;

export type DepositResponseMoneyMatrix = DepositResponse;
export interface WithdrawResponse {
  TransactionId: number;
  MerchantInvoiceId: string;
  Currency: string;
  Amount: number;
  ConvertedCurrency: string;
  ConvertedAmount: number;
  FeeAmount: number;
  Status: number;
  Message: string;
  CustomerEmail: string;
  Hash: string;
  Process: string;
  code?: number; // in case of error
  message?: string; // in case of error
}

export interface MoneyMatrixConfirmationBase {
  TransactionId: string;
  Amount: number;
  FeeAmount: number;
  MerchantInvoiceId: string;
  Currency: string;
  LiquidationDate: string;
  Message: string;
  CustomerEmail: string;
}
export interface PayInConfirmationPayload extends MoneyMatrixConfirmationBase {
  Status: string;
  Sign: string;
  PaymentMethod: string;
}

export interface PayOutConfirmationPayload extends MoneyMatrixConfirmationBase {
  TransactionId: string;
  Amount: number;
  FeeAmount: number;
  MerchantInvoiceId: string;
  Currency: string;
  Status: string;
  LiquidationDate: string;
  Message: string;
  CustomerEmail: string;
  Hash: string;
  Process: "PayOut" | "Screening";
}

export enum PixType {
  CPF = "CPF",
  Email = "Email",
  Telefone = "Telefone",
}

export function isPayInConfirmationPayload(
  payload: PayInConfirmationPayload | any
): payload is PayInConfirmationPayload {
  return payload?.Sign !== undefined;
}

export function isPayOutConfirmationPayload(
  payload: PayOutConfirmationPayload | any
): payload is PayOutConfirmationPayload {
  return payload?.Process !== undefined;
}

export function isMoneyMatrixDepositResponse(
  payload: DepositResponse | any
): payload is DepositResponse {
  return payload?.url !== undefined;
}
