// import axios from "axios";

import HttpStatus from "http-status";
import currency from "currency.js";

// import { ApiError } from "utils/ApiError";

import { Response } from "types/response";
import { DepositRequestParams, WithdrawRequestParams, WithdrawResponse } from "./types";
// import { TransactionStatus } from "types/GatewayService";
import WebApiService, { WebApiConfig } from '@/hooks/useSession/services/webapi.service';

export interface MoneyMatrixParams {

}

export class MoneyMatrixService {

  private webApiService: WebApiService;

  constructor(params: MoneyMatrixParams) {
    this.webApiService = new WebApiService();
  }

  async withdraw(
    params: WithdrawRequestParams
  ) {

  }

  async deposit(params: DepositRequestParams) {
    try {
      const config = {
        fields: {
          currency: params.currency,
          amount: currency(params.amount).value,
          BonusCode: params.bonusCode,
          gamingAccountID: params.gamingAccountID
        }
      };
      const response = await this.webApiService.call("/user/hostedcashier#deposit", config);
      return {
        error: false,
        statusCode: HttpStatus.OK,
        data: { url: response.cashierUrl },
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


}
