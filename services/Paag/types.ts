export interface DepositRequestParams {
  partner_user_document: string;
  partner_user_email: string;
  partner_user_name: string;
  partner_order_number: string;
  partner_order_amount: string;
  processor_id: string;
  merchant_transaction_id: string;
  amount: string;
  first_name: string;
  last_name: string;
  email: string;
  document_number: string;
}

export interface DepositResponse {
  transaction: Transaction;
  [key: string]: any;
}

export interface Transaction {
  id: string;
  merchant_id: string;
  user_id: string;
  processor_id: string;
  merchant_transaction_id: string;
  transaction_type: string;
  first_name: string;
  last_name: string;
  email: string;
  updated_at: string;
  created_at: string;
  events: Event[];
  document_number: string;
  status: string;
  flow_type: string;
  error: any;
}

export interface Event {
  id: string;
  success: boolean;
  status: string;
  event_type: string;
  amount: string;
  ip_address: any;
  processor_transaction_id: string;
  batch_id: any;
  qrcode: string;
  qrcode_image: string;
  pix_key_type: any;
  pix_key_value: any;
  pix_message: any;
  updated_at: string;
  created_at: string;
}

export type DepositResponsePaag = DepositResponse;

export type TransactionStatusResponse = {};

export type TransactionStatusResponsePaag = TransactionStatusResponse;

export function isTransactionCanceledPaag(data) {
  // if (CANCELED_STATUS.includes(data.order_status_id.toString())) {
  //   return true;
  // }

  return false;
}
export function isTransactionApprovedPaag(data) {
  const event = data.events.length > 0 ? data.events[0] : null;

  if (!event) {
    return false;
  }

  if (event.success && event.event_type === "capture") {
    return true;
  }

  return false;
}

export interface WithdrawRequestParams {
  processor_id: string;
  merchant_transaction_id: string;
  amount: number;
  pix_key_type: string;
  pix_key_value: string;
  pix_message?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  document_number?: string;
}

export interface WithdrawResponse {}

enum WebhookEvents {
  auth = "auth",
  capture = "capture",
  payment = "payment",
  transfer = "transfer",
  refund = "refund",
}

enum PayInConfirmationEvents {
  auth = WebhookEvents.auth,
  capture = WebhookEvents.capture,
  refund = WebhookEvents.refund,
}

enum PayOutConfirmationEvents {
  payment = WebhookEvents.payment,
  transfer = WebhookEvents.transfer,
  refund = WebhookEvents.refund,
}

export interface PaagConfirmationBase {
  transaction: Transaction;
}

export interface PayInConfirmationPayload extends PaagConfirmationBase {
  event: PayInConfirmationEvents;
}

export interface PayOutConfirmationPayload extends PaagConfirmationBase {
  event: PayOutConfirmationEvents;
}

export enum PixType {
  CPF = "document",
  Email = "email",
  Telefone = "phone",
  "Chave Aleatória" = "random",
}

export function isPayInConfirmationPayload(
  payload: PayInConfirmationPayload | any,
): payload is PayInConfirmationPayload {
  return Object.values(PayInConfirmationEvents).includes(payload?.event);
}

export function isPayOutConfirmationPayload(
  payload: PayOutConfirmationPayload | any,
): payload is PayOutConfirmationPayload {
  return Object.values(PayOutConfirmationEvents).includes(payload?.event);
}

export function isPaagDepositResponse(
  payload: DepositResponse | any,
): payload is DepositResponse {
  return payload?.transaction !== undefined;
}

export function isPaagConfirmationPayload(
  payload: PayInConfirmationPayload | any,
): payload is PayInConfirmationPayload {
  return payload?.transaction?.events !== undefined;
}

export interface DefaultResponse<T> {
  error: boolean;
  message?: string;
  data: T;
  status?: number;
  orderStatus?: number;
}

export type EndpointName = "pay" | "charge" | "transactions" | "transaction";
