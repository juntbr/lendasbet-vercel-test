import axios from "axios";
import crypto from "crypto";
import currency from "currency.js";
import HttpStatus from "http-status";

import { ApiError } from "utils/ApiError";
import { PixType } from "services/Pay4Fun/types";

import { CurrentCode } from "constants/currency";
import { OrderStatus, TransactionStatus } from "types/GatewayService";
import { Response } from "types/response";
import {
  DepositRequestParams,
  DepositResponse,
  isPayInConfirmationPayload,
  isPayOutConfirmationPayload,
  PayInConfirmationPayload,
  PaymentMethod,
  PayOutConfirmationPayload,
  ScreeningRequestParams,
  ScreeningResponse,
  WithdrawRequestParams,
  WithdrawResponse,
} from "./types";
import dayjs from "dayjs";

export interface Pay4FunParams {
  url: string;
  merchantId: string;
  merchantKey: string;
  merchantSecret: string;
  okUrl: string;
  notOkUrl: string;
  confirmationUrl: string;
  merchantLogo?: string;
  layoutColor?: string;
}

export class Pay4FunService {
  private url: string;
  private merchantId: string;
  private merchantKey: string;
  private merchantSecret: string;
  private okUrl: string;
  private notOkUrl: string;
  private confirmationUrl: string;
  private merchantLogo?: string;
  private layoutColor?: string;

  constructor(params: Pay4FunParams) {
    this.url = params.url;
    this.merchantId = params.merchantId;
    this.merchantKey = params.merchantKey;
    this.merchantSecret = params.merchantSecret;
    this.okUrl = params.okUrl;
    this.notOkUrl = params.notOkUrl;
    this.confirmationUrl = params.confirmationUrl;
    this.merchantLogo = params.merchantLogo;
    this.layoutColor = params.layoutColor;
  }

  generateHash(content: any) {
    const hash = crypto.createHmac("sha256", this.merchantKey);

    hash.update(content, "utf8");

    return hash.digest("hex").toUpperCase();
  }

  async withdraw(
    withdrawparams: WithdrawRequestParams,
  ): Promise<Response<WithdrawResponse | null>> {
    let params = {
      fullName: withdrawparams.partner_user_name,
      targetCustomerBirthDate: withdrawparams.partner_user_birthday, // yyyy-mm-dd
      amount: withdrawparams.partner_order_amount,
      currency: CurrentCode.BRL,
      merchantInvoiceId: withdrawparams.partner_order_number,
      confirmationUrl: withdrawparams.confirmationUrl,
      targetCustomerEmail: withdrawparams.partner_user_email,
      targetCustomerMainId: withdrawparams.partner_user_document,
      pixKeyType: withdrawparams.partner_withdraw_pixtype,
      language: withdrawparams.language ?? "pt-BR",
    };

    if (withdrawparams.partner_withdraw_pixtype === PixType.Telefone) {
      const phone = withdrawparams.partner_withdraw_pixkey;

      const withoutAreaCode = phone
        .replace(/\D/g, "")
        .replace(/^0+/, "")
        .substring(2);
      const areaCode = phone
        .replace(/\D/g, "")
        .replace(/^0+/, "")
        .substring(0, 2);

      const phonePixKeyTypeExtraParams = {
        targetCustomerPhoneNumber: withoutAreaCode,
        targetCustomerPhoneNumberAreaCode: areaCode,
        targetCustomerPhoneNumberCountryCode: "+55",
      };
      params = { ...params, ...phonePixKeyTypeExtraParams };
    }

    try {
      const fixedAmount = currency(params.amount).intValue;

      const hash = this.generateHash(
        `${this.merchantId}${fixedAmount}${params.merchantInvoiceId}${params.targetCustomerEmail}${this.merchantSecret}`,
      );

      const headers = {
        "Content-Type": "application/json",
        merchantId: this.merchantId,
        hash,
      };

      const config = {
        method: "POST",
        url: `${this.url}/1.0/goout/process/`,
        data: {
          ...params,
          amount: currency(params.amount).value,
          merchantId: this.merchantId,
          language: params.language ?? "pt-BR",
          confirmationUrl: params.confirmationUrl ?? this.confirmationUrl,
          hash,
        },
        headers,
      };

      const response = await axios<WithdrawResponse>(config);

      if (response.data?.code !== undefined) {
        throw new Error(response.data?.message);
      }

      return {
        statusCode: HttpStatus.OK,
        status: TransactionStatus.SUCCESS,
        error: false,
        data: {
          error: false,
          error_code: "",
          error_msg: "",
          partner_user_uid: withdrawparams.partner_user_uid,
          partner_user_document: withdrawparams.partner_user_document,
          partner_order_number: withdrawparams.partner_user_document,
          partner_order_amount: withdrawparams.partner_user_document,
          order_status_id: OrderStatus.APPROVED,
          order_created_at: dayjs().format(),
          order_valid_at: dayjs().add(1, "D").format(),
          order_updated_at: dayjs().format(),
          pix_message: "",
        },
        message: "",
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        status: TransactionStatus.FAILED,
        error: true,
        data: null,
        message:
          error.response?.data?.message ?? error?.message ?? "Falha no saque.",
      };
    }
  }

  async deposit(depositParams: DepositRequestParams) {
    const params = {
      amount: depositParams.partner_order_amount,
      currency: depositParams.currency ?? CurrentCode.BRL,
      merchantInvoiceId: depositParams.partner_order_number,
      okUrl: depositParams.okUrl,
      notOkUrl: depositParams.notOkUrl,
      confirmationUrl: depositParams.confirmationUrl,
    };

    const DEFAULT_PAYMENT_METHOD = PaymentMethod.Pix;

    try {
      const fixedAmount = currency(params.amount).intValue;

      const hash = this.generateHash(
        `${this.merchantId}${fixedAmount}${params.merchantInvoiceId}${this.merchantSecret}`,
      );

      const headers = {
        "Content-Type": "application/json",
        merchantId: this.merchantId,
        hash,
      };

      const config = {
        method: "POST",
        url: `${this.url}/1.0/go/process/`,
        data: {
          ...params,
          amount: currency(params.amount).value,
          paymentMethod: params?.paymentMethod ?? DEFAULT_PAYMENT_METHOD,
          language: params.language ?? "pt-BR",
          okUrl: params.okUrl ?? this.okUrl,
          notOkUrl: params.notOkUrl ?? this.notOkUrl,
          confirmationUrl: params.confirmationUrl ?? this.confirmationUrl,
          merchantLogo: params.merchantLogo ?? this.merchantLogo,
          layoutColor: params.layoutColor ?? this.layoutColor,
        },
        headers,
      };

      const response = await axios<DepositResponse>(config);

      if (response.data.code !== HttpStatus.CREATED) {
        throw new Error(response.data.message);
      }

      return {
        error: false,
        statusCode: HttpStatus.OK,
        data: {
          ...response.data,
          transactionId: depositParams.partner_order_number,
        },
        message: "Depósito realizado com sucesso.",
      };
    } catch (error) {
      return {
        error: true,
        statusCode: HttpStatus.BAD_REQUEST,
        data: null,
        message:
          error.response?.data?.message ??
          error?.message ??
          "Falha no depósito.",
      };
    }
  }

  async screening(params: ScreeningRequestParams) {
    try {
      const fixedAmount = currency(params.amount).intValue;

      const hash = this.generateHash(
        `${this.merchantId}${fixedAmount}${params.merchantInvoiceId}${params.targetCustomerEmail}${this.merchantSecret}`,
      );

      const headers = {
        "Content-Type": "application/json",
      };

      const config = {
        method: "POST",
        url: `${this.url}/1.0/goout/screening/`,
        data: {
          ...params,
          merchantId: this.merchantId,
          amount: currency(params.amount).value,
          language: params.language ?? "pt-BR",
          okUrl: params.okUrl ?? this.okUrl,
          notOkUrl: params.notOkUrl ?? this.notOkUrl,
          confirmationUrl: params.confirmationUrl ?? this.confirmationUrl,
          merchantLogo: params.merchantLogo ?? this.merchantLogo,
          layoutColor: params.layoutColor ?? this.layoutColor,
          hash,
        },
        headers,
      };

      const response = await axios<ScreeningResponse>(config);

      if (response.data.code !== HttpStatus.OK) {
        throw new ApiError(response.data.message, {
          statusCode: response.data.code,
        });
      }

      return {
        error: false,
        statusCode: HttpStatus.OK,
        data: response.data,
        message: "Screening iniciado com sucesso.",
      };
    } catch (error) {
      return {
        error: true,
        statusCode: error?.statusCode ?? HttpStatus.BAD_REQUEST,
        data: null,
        message:
          error.response?.data?.message ??
          error?.message ??
          "Falha ao iniciar screening.",
      };
    }
  }

  async checkTransaction(
    params: PayInConfirmationPayload | PayOutConfirmationPayload,
  ) {
    try {
      const requestStatus = Number(params?.Status);

      if (
        requestStatus !== HttpStatus.CREATED &&
        requestStatus !== HttpStatus.PROCESSING &&
        params?.Status !== HttpStatus[201] &&
        params?.Status !== HttpStatus[102]
      ) {
        throw new Error("Transação falhou.");
      }

      if (isPayInConfirmationPayload(params)) {
        const fixedAmount = currency(params.Amount).intValue;

        const generatedSign = this.generateHash(
          `${this.merchantId}${fixedAmount}${params.MerchantInvoiceId}${params.Status}`,
        );

        if (generatedSign !== params.Sign) {
          throw new Error("Assinatura inválida.");
        }

        const isSuccess = params.Status === "201";

        return {
          error: false,
          statusCode: isSuccess ? HttpStatus.OK : HttpStatus.PROCESSING,
          status: isSuccess
            ? TransactionStatus.SUCCESS
            : TransactionStatus.PENDING,
          message: isSuccess ? "Transação confirmada." : "Transação pendente.",
        };
      }

      if (isPayOutConfirmationPayload(params)) {
        const fixedAmount = currency(params.Amount).intValue;

        const generatedHash = this.generateHash(
          `${this.merchantId}${fixedAmount}${params.MerchantInvoiceId}${params.CustomerEmail}`,
        );

        if (generatedHash !== params.Hash) {
          throw new Error("Assinatura inválida.");
        }

        const isSuccess = params.Message === "success";

        return {
          error: false,
          statusCode: isSuccess ? HttpStatus.OK : HttpStatus.PROCESSING,
          status: isSuccess
            ? TransactionStatus.SUCCESS
            : TransactionStatus.PENDING,
          message: isSuccess ? "Transação confirmada." : "Transação pendente.",
        };
      }
    } catch (error) {
      return {
        error: true,
        statusCode: HttpStatus.OK,
        status: TransactionStatus.FAILED,
        message: error.message,
      };
    }
  }

  isConfirmation(
    payload: PayInConfirmationPayload | any,
  ): payload is PayInConfirmationPayload {
    return payload?.MerchantInvoiceId !== undefined;
  }
}
