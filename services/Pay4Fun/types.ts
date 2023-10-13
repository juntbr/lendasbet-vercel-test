import { CurrentCode } from "constants/currency";

export type Language = "pt-BR" | "en-US" | "es-ES";

export enum PaymentMethod {
  Boleto = "Boleto",
  BankTransfer = "BankTransfer",
  Pix = "PIX",
}

export interface Pay4FunConfigUrls {
  okUrl?: string;
  notOkUrl?: string;
  confirmationUrl?: string;
}

export interface WithdrawRequestParams {
  partner_user_uid: any;
  partner_user_email: any;
  partner_user_document: any;
  partner_withdraw_pixkey: any;
  partner_withdraw_pixtype: any;
  partner_order_number: any;
  partner_order_amount: any;
  partner_user_birthday: any;
  partner_user_name: any;
  targetCustomerBirthDate: string;
  fullName: string;
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

export interface DepositRequestParams extends Pay4FunConfigUrls {
  BRL: any;
  partner_order_amount: any;
  partner_order_number: any;
  amount: number | string;
  merchantInvoiceId: string;
  currency: CurrentCode; //ISO 4217
  language?: Language;
  paymentMethod?: PaymentMethod;
  merchantLogo?: string;
  layoutColor?: string;
}
export interface ScreeningRequestParams extends Pay4FunConfigUrls {
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

export type DepositResponsePay4Fun = DepositResponse;
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

export interface Pay4FunConfirmationBase {
  TransactionId: string;
  Amount: number;
  FeeAmount: number;
  MerchantInvoiceId: string;
  Currency: string;
  LiquidationDate: string;
  Message: string;
  CustomerEmail: string;
}
export interface PayInConfirmationPayload extends Pay4FunConfirmationBase {
  Status: string;
  Sign: string;
  PaymentMethod: string;
}

export interface PayOutConfirmationPayload extends Pay4FunConfirmationBase {
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
  payload: PayInConfirmationPayload | any,
): payload is PayInConfirmationPayload {
  return payload?.Sign !== undefined;
}

export function isPayOutConfirmationPayload(
  payload: PayOutConfirmationPayload | any,
): payload is PayOutConfirmationPayload {
  return payload?.Process !== undefined;
}

export function isPay4FunDepositResponse(
  payload: DepositResponse | any,
): payload is DepositResponse {
  return payload?.url !== undefined;
}
