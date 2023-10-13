import HttpStatus from 'http-status';
import fetch from 'node-fetch';

import { ApiError } from 'utils/ApiError';
import { TransactionStatus } from 'types/GatewayService';
import { Response } from 'types/response';
import endpoints from './endpoints';
import {
  DefaultResponse,
  DepositRequestParams,
  DepositResponse,
  EndpointName,
  PayInConfirmationPayload,
  PayOutConfirmationPayload,
  WithdrawRequestParams,
  WithdrawResponse,
} from './types';

type ErrorStructure = {
    message: {
      pix_key_value: string[];
    };
};

export class PaagService {
  private defaultHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.PAAG_API_TOKEN}`,
  };

  async withdraw(params: WithdrawRequestParams): Promise<Response<WithdrawResponse | null>> {
    try {
      const response = await this.makeRequest('pay', params);
      if(response.error){
        throw new Error(JSON.stringify(response.message));
      }
      return this.handleSuccessResponse(response, 'Saque realizado com sucesso.');
    } catch (error) {
      const jsonMessage = error.message ? JSON.parse(error.message) : "";
      const translatedMessage = PaagService.translateErrorToPortuguese(jsonMessage);
      return this.handleErrorResponse(error, translatedMessage);
    }
  }

  async deposit(params: DepositRequestParams): Promise<Response<DepositResponse | null>> {
    const depositRequestParams = {
      processor_id: process.env.PAAG_PROCESSOR_ID,
      amount: params.partner_order_amount,
      merchant_transaction_id: params.partner_order_number,
      first_name: params.partner_user_name,
      last_name: params.partner_user_name,
      email: params.partner_user_email,
      document_number: params.partner_user_document,
    };

    try {
      const { error, data, message } = await this.makeRequest('charge', depositRequestParams);

      if (error) {
        throw new Error(message);
      }

      return this.handleSuccessResponse(
        { data: { ...data, transactionId: params.partner_order_number } },
        'Depósito realizado com sucesso.'
      );
    } catch (error) {
      return this.handleErrorResponse(error, error ?? 'Falha no depósito.');
    }
  }

  async checkTransaction(params: PayInConfirmationPayload | PayOutConfirmationPayload) {
    const transaction = params.transaction;
    const isDeposit = transaction?.merchant_transaction_id.includes('DEPOSIT');

    try {
      if (isDeposit) {
        if (transaction.events.length === 0) {
          throw new ApiError('Transação não possui eventos');
        }

        const isSuccess =
          transaction.events[0].event_type === 'capture' &&
          transaction.events[0].success;

        return this.handleSuccessResponse(
          {
            status: isSuccess ? TransactionStatus.SUCCESS : TransactionStatus.PENDING,
            statusCode: isSuccess ? HttpStatus.OK : HttpStatus.PROCESSING,
            statusMessage: isSuccess ? TransactionStatus.SUCCESS : TransactionStatus.PENDING,
          },
          isSuccess ? 'Transação confirmada.' : 'Transação pendente.'
        );
      }

      if (transaction.events.length === 0) {
        throw new ApiError('Transação não possui eventos');
      }

      const isSuccess =
        transaction.events[0].event_type === 'transfer' &&
        transaction.events[0].success;

      return this.handleSuccessResponse(
        {
          status: isSuccess ? TransactionStatus.SUCCESS : TransactionStatus.PENDING,
          statusCode: isSuccess ? HttpStatus.OK : HttpStatus.PROCESSING,
          statusMessage: isSuccess ? TransactionStatus.SUCCESS : TransactionStatus.PENDING,
        },
        isSuccess ? 'Transação confirmada.' : 'Transação pendente.'
      );
    } catch (error) {
      return this.handleErrorResponse(error, error.message);
    }
  }

  async checkTransactionStatus(transactionId) {
    const { data } = await this.makeRequest('transaction', {}, this.defaultHeaders, `${transactionId}`);
    return data;
  }

  isConfirmation(payload: PayInConfirmationPayload | any): payload is PayInConfirmationPayload {
    return payload?.transaction !== undefined && payload?.event !== undefined;
  }

  private async makeRequest<T = any>(
    name: EndpointName,
    params: object = {},
    headers = this.defaultHeaders,
    urlParam = '',
  ): Promise<DefaultResponse<T>> {
    const endpoint = endpoints[name];

    function isObjectEmpty(obj) {
      return Object.keys(obj).length === 0;
    }

    const url = `${process.env.PAAG_API_URL}${endpoint.uri}${urlParam}`;

    const config = {
      method: endpoint.method,
      url,
      body: isObjectEmpty(params) ? null : JSON.stringify(params),
      headers,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (data?.error) {
        throw new Error(JSON.stringify(data?.error?.message) ?? 'Erro desconhecido');
      }

      return {
        error: false,
        data,
        status: response.status,
        orderStatus: data?.transaction?.events?.length > 0 ? data.transaction.events[0].status : null,
      };
    } catch (error) {

      const jsonMessage = error.message ? JSON.parse(error.message) : "";

      return {
        error: true,
        message: jsonMessage,
        data: jsonMessage,
        status: 500,
        orderStatus: null,
      };
    }
  }

  private handleSuccessResponse(data: any, message: string) {
    return {
      error: false,
      status: data.status,
      statusCode: HttpStatus.OK,
      statusMessage: data.statusMessage,
      data: data.data,
      message,
    };
  }

  private handleErrorResponse(error: any, message: string) {
    return {
      error: true,
      statusCode: HttpStatus.BAD_REQUEST,
      statusMessage: "ERROR",
      data: null,
      message,
    };
  }

  static translateErrorToPortuguese(errorStructure: ErrorStructure): string {
    const translations: { [key: string]: string } = {
      'Destination account mismatch': 'O destino da conta não corresponde',
      'CPF is not regular': 'O CPF não é regular',
      'Customer is under age (less than 18y)': 'O cliente é menor de idade (menos de 18 anos)',
      'Invalid pix key': 'Chave PIX inválida',
      'CPF doesn`t exist': 'O CPF não existe',
      'Informed tax ID does not match account owner': 'O CPF/CNPJ informado não confere com o destinatário',
      'Invalid CPF or CNPJ': 'CPF ou CNPJ inválido',
      'Invalid CNPJ or CPF': 'CNPJ ou CPF inválido',
      'Invalid CNPJ, CPF, identifier, state inscription, CAD inscription or ICMS':
        'CNPJ, CPF, identificador, inscrição estadual, inscrição no CAD ou ICMS inválido',
    };

    
    const errorMessage = Object.values(errorStructure)[0][0];
    return translations[errorMessage] || 'Erro desconhecido';
  }
}
