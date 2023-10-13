import { describe, expect } from "@jest/globals";
import HttpStatus from "http-status";
import mockAxios from "jest-mock-axios";
import { uuid } from "uuidv4";

// import { CurrentCode } from "constants/currency";

import { PaagService } from "./PaagService";
// import { PaymentMethod, PayOutConfirmationPayload } from "./types";
// import currency from "currency.js";
// import { TransactionStatus } from "types/GatewayService";

const baseData = {
  processor_id: process.env.PAAG_PROCESSOR_ID,
  amount: "100",
};

const depositData = {
  ...baseData,
  merchant_transaction_id: `DEPOSIT_${uuid()}_GATEWAY_PAAG`,
  first_name: "Teste T",
  last_name: "A",
  email: "isis-nascimento83@raninho.com.br",
  document_number: "103.488.438-79",
};

const withdrawData = {
  ...baseData,
  merchant_transaction_id: `WITHDRAW_${uuid()}_GATEWAY_PAAG`,
  pix_key_type: "cpf",
  pix_key_value: "103.488.438-79",
};

const confirmationPayload = {
  TransactionId: "TRANSACTION_ID",
  Amount: 20,
  FeeAmount: 0,
  MerchantInvoiceId: "MERCHANT_INVOICE_ID",
  Currency: "BRL",
  Status: "201",
  LiquidationDate: "2023-02-25",
  Message: "",
  CustomerEmail: "",
  Sign: "VALID_SIGN",
  PaymentMethod: "",
};

const requestHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
  Authorization: `Bearer ${process.env.PAAG_API_TOKEN}`,
};

describe("PaagService", () => {
  let paagService: PaagService;

  beforeEach(() => {
    mockAxios.reset();

    paagService = new PaagService();
  });

  it("should make a successful deposit", async () => {
    const response = await paagService.deposit(depositData);

    expect(response).toEqual({
      error: false,
      statusCode: HttpStatus.OK,
      data: response.data,
      message: "Depósito realizado com sucesso.",
    });
  });

  it("should make a successful withdraw", async () => {
    const response = await paagService.withdraw(withdrawData);

    expect(response).toEqual({
      error: false,
      statusCode: HttpStatus.OK,
      data: response.data,
      message: "Saque realizado com sucesso.",
    });
  });

  // it("should fail if deposit response code from Paag is different than 200", () => {
  //   const response = {
  //     code: HttpStatus.BAD_REQUEST,
  //     message: "Falha no depósito.",
  //   };

  //   const request = paagService.deposit(depositData);

  //   mockAxios.mockResponse({
  //     data: response,
  //   });

  //   expect(request).resolves.toEqual({
  //     error: true,
  //     statusCode: HttpStatus.BAD_REQUEST,
  //     message: response.message,
  //     data: null,
  //   });
  // });

  // it("should fail if checkTransaction is called with invalid sign", async () => {
  //   jest.clearAllMocks();

  //   const response = await paagService.checkTransaction({
  //   //   ...confirmationPayload,
  //   //   Amount: 100,
  //   });

  //   expect(response).toEqual({
  //     error: true,
  //     statusCode: HttpStatus.OK,
  //     status: TransactionStatus.FAILED,
  //     message: "Assinatura inválida.",
  //   });
  // });

  // it("should pass if checkTransaction is called with valid sign deposit", async () => {
  //   jest.clearAllMocks();

  //   const generateHashMock = jest
  //     .spyOn(PaagService, "generateHash")
  //     .mockReturnValue(confirmationPayload.Sign);

  //   const response = await PaagService.checkTransaction({
  //     ...confirmationPayload,
  //     Message: "success",
  //   });

  //   const fixedAmount = currency(confirmationPayload.Amount).intValue;

  //   expect(generateHashMock).toBeCalledWith(
  //     `${process.env.Paag_MERCHANT_ID}${fixedAmount}${confirmationPayload.MerchantInvoiceId}${confirmationPayload.Status}`
  //   );

  //   expect(response).toEqual({
  //     error: false,
  //     statusCode: HttpStatus.OK,
  //     status: TransactionStatus.SUCCESS,
  //     message: "Transação confirmada.",
  //   });
  // });
});
