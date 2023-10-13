import { SubscribeHandler } from "autobahn";

export interface WebApiConfig {
  url: string;
  realm: string;
}

export interface SessionCallSucessResponse<T> {
  kwargs: T;
}

export interface SessionCallErrorResponse {
  kwargs: object;
}

export interface InitializeParams {
  withRegistration?: boolean;
  cId?: string;
  onOpen?: (data?: any) => void;
  onClose?: (data: { reason: string; message: string }) => void;
  onSessionStateChange?: (code: SessionStateCode) => void;
}

export interface ConnectionParams {
  cId?: string;
  onOpen?: (data?: any) => void;
  onClose?: (reason?: any) => void;
}

export interface RegistrationDismissed {
  procedure?: string;
}

export type Handler = SubscribeHandler<any[], any, string>;

export interface ConectionTransport {
  type: string;
  url: string;
  max_retries?: number;
}

export interface ConnectionBasic {
  url?: string;
  realm?: string;
  transports?: ConectionTransport[];
  onchallenge?: (data?: any) => void;
}

export enum SessionStateCode {
  LOGGED = 0,
  EXPIRED = 1,
  TERMINATED_BY_USER = 2,
  TERMINATED_BY_MULTIPLES_LOGINS = 3,
  TERMINATED_BY_PRESENT_LIMITATION = 5,
  TERMINATED_BY_SELF_EXCLUSION = 5,
}

// export const SESSION_STATES_CODE_MESSAGES = [
//   "Você logou com sucesso!",
//   "Sua sessão expirou!",
//   "Você saiu com sucesso!",
//   "Você foi desconectado por ter se conectado em outro lugar!",
//   "Você foi desconectado, sua sessão expirou",
//   "Você foi desconectado, sua sessão expirou ",
// ];

export const SESSION_STATES_CODE_MESSAGES = [
  "You have successfully logged in!",
  "Your session has expired!",
  "You have successfully logged out!",
  "You have been disconnected for logging in from another location!",
  "You have been disconnected, your session has expired.",
  "You have been disconnected, your session has expired.",
];

export interface onSessionStateParams {
  code: SessionStateCode;
  desc: string;
}
