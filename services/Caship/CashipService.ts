import axios from "axios";
import HttpStatus from "http-status";

import {
  CashipNotificationPayload,
  CashipTransactionStatus,
  CheckResponse,
  DepositRequest,
  WithdrawRequest,
} from "types/caship";
import { TransactionStatus } from "types/GatewayService";
import { CashipApi } from ".";
import { cashipErrorMessages } from "./cashipErrorMessages";
import { ApiError } from "utils/ApiError";

export interface CashipParams {
  url: string;
  token: string;
}

export class CashipService {
  private url: string;
  private token: string;

  constructor(params: CashipParams) {
    this.url = params.url;
    this.token = params.token;
  }

  async withdraw(params: WithdrawRequest) {
    const cashipParams = Object.fromEntries(
      Object.entries(params).filter(([key, val]) => {
        const exclude = [
          "created_at",
          "transactionId",
          "updated_at",
          "orderStatus",
        ];
        return exclude.filter((a) => a === key);
      }),
    );

    try {
      const { error, data, status } = await CashipApi("withdraw", cashipParams);

      if (error) {
        const message = cashipErrorMessages(data?.error_code);

        throw new ApiError(message, {
          statusCode: status,
        })
      }

      return {
        statusCode: HttpStatus.OK,
        status: TransactionStatus.SUCCESS,
        error: false,
        data,
        message: "",
      };

    } catch(e) {
      let message = e.message;

      if(e.data) {
        message = cashipErrorMessages(e.data?.error_code);
      }

      return {
        statusCode: HttpStatus.BAD_REQUEST ?? 500,
        status: TransactionStatus.FAILED,
        error: true,
        data: null,
        message: message ?? "Falha no saque.",
      };
    }
  }

  async deposit(params: DepositRequest) {
    const { error, data, status } = await CashipApi("deposit", params);

    if (error) {
      const message = cashipErrorMessages(data?.error_code);

      return { statusCode: status, error: true, data, message };
    }

    return {
      statusCode: status,
      error: false,
      data: { ...data, transactionId: data.partner_order_number },
      message: "",
    };
  }

  async checkTransaction(params: any) {
    try {
      const checkCashipTransaction = await axios.post<CheckResponse>(
        `${this.url}/ewallet/api/check`,
        params,
        {
          headers: {
            Authorization: `Basic ${this.token}`,
          },
        },
      );
      
      if (
        checkCashipTransaction.data.check !== "ok" &&
        process.env.NODE_ENV === "production"
      ) {
        return {
          error: true,
          statusCode: HttpStatus.BAD_REQUEST,
          status: TransactionStatus.FAILED,
          message: "Transação não encontrada.",
        };
      }

      if (params.order_status_id != CashipTransactionStatus.approved) {
        return {
          error: true,
          statusCode: HttpStatus.OK,
          status: TransactionStatus.FAILED,
          message: "Transação não aprovada.",
        };
      }

      return {
        error: false,
        statusCode: HttpStatus.OK,
        status: TransactionStatus.SUCCESS,
        message: "Transação aprovada.",
      };
    } catch (error) {
      return {
        error: true,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        status: TransactionStatus.FAILED,
        message: error,
      };
    }
  }

  isConfirmation(
    payload: CashipNotificationPayload | any,
  ): payload is CashipNotificationPayload {
    return payload?.partner_order_amount !== undefined;
  }
}
