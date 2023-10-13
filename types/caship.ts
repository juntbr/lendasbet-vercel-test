export interface UserInfoRequest {
  partner_user_uid: string;
  partner_user_name: string;
  partner_user_email: string;
  partner_user_document: string;
  partner_user_birthday: string; //YYYY-MM-DD
  partner_user_zipcode: string;
  partner_user_mobile: string;
}

export interface OrderInfoRequest {
  partner_order_number: string;
  partner_order_amount: string; //DECIMAL(12,2) 	2928.99
  partner_order_method: number;
  partner_order_group: number;
}

export interface DepositRequest extends UserInfoRequest, OrderInfoRequest {}

export interface WithdrawRequest extends UserInfoRequest, OrderInfoRequest {
  partner_withdraw_pixtype: string;
  partner_withdraw_pixkey: string;
  partner_withdraw_pwd: string;
  realtime: boolean;
}

export interface DefaultResponse {
  error: boolean;
  data: any;
  status?: number;
  orderStatus?: number;
}

export type EndpointName =
  | "deposit"
  | "withdraw"
  | "check"
  | "transaction"
  | "validateCPF";

export type Endpoint = {
  name: EndpointName;
  method: "POST" | "GET" | "PUT" | "DELETE";
  uri: string;
};

export enum CashipTransactionStatus {
  "pending" = 1,
  "compliance" = 2,
  "settled" = 6,
  "canceled" = 3, // canceled_by_the_user
  "canceled_starspay" = 4, //canceled_by_starspay
  "refused" = 5, //refused_by_the_bank
  "approved" = 7, //
}

export type CashipNotificationPayload = {
  partner_user_uid: string;
  partner_user_document: string;
  partner_order_number: string;
  partner_order_amount: string;
  partner_order_method: number;
  partner_order_group: number;
  order_status_id: number;
  order_created_at: string; // YYYY-MM-DD HH:MM:SS
  order_valid_at: string; // YYYY-MM-DD HH:MM:SS
  order_updated_at: string; // YYYY-MM-DD HH:MM:SS
};

export type WithdrawResponse = {
  error: boolean;
  error_code: string;
  error_msg: string;
  partner_user_uid: string;
  partner_user_document: string;
  partner_order_number: string;
  partner_order_amount: string;
  partner_order_method?: number;
  partner_order_group?: number;
  order_status_id: number;
  order_created_at: string;
  order_valid_at: string;
  order_updated_at: string;
  pix_message: string;
};

export type CashipNotificationRequest = {
  partner_user_uid: string;
  partner_user_document: string;
  partner_order_number: string;
  partner_order_amount: string;
  partner_order_method: number;
  partner_order_group: number;
  order_status_id: number;
  order_created_at: string;
  order_valid_at: string;
  order_updated_at: string;
};

export type DepositResponse = {
  transactionId: any;
  id: string;
  qrcode_image(qrcode_image: any): unknown;
  error: boolean;
  error_code: string;
  error_msg: string;
  partner_user_uid: string;
  partner_user_document: string;
  partner_order_number: string;
  partner_order_amount: string;
  partner_order_method: number;
  partner_order_group: number;
  order_operation_id: number;
  order_status_id: number;
  order_created_at: string;
  order_valid_at: string;
  order_updated_at: string;
  pix_copiacola: string;
  pix_qrcode_url: string;
  pix_message: string;
};

export type DepositResponseCaship = DepositResponse;

export interface CheckResponse {
  error: boolean;
  error_code: string;
  error_msg: string;
  check: "ok" | "nok";
}

export enum PixType {
  "CPF" = "CPF",
  "Email" = "Email",
  "Telefone" = "phone",
  "Chave Aleatória" = "EVP",
}

export function isCashipDepositResponse(
  payload: DepositResponse | any,
): payload is DepositResponse {
  return payload?.partner_user_uid !== undefined;
}

export function isCashipConfirmation(
  payload: any,
): payload is CashipNotificationRequest {
  return payload?.partner_user_uid !== undefined;
}
