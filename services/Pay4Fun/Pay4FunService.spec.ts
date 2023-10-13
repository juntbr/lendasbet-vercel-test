import { describe, expect } from "@jest/globals";
import mockAxios from "jest-mock-axios";
import HttpStatus from "http-status";

import { CurrentCode } from "constants/currency";

import { Pay4FunService } from "./Pay4FunService";
import { PaymentMethod, PayOutConfirmationPayload } from "./types";
import currency from "currency.js";
import { TransactionStatus } from "types/GatewayService";

const baseData = {
  amount: 100,
  currency: CurrentCode.BRL,
};

const depositData = {
  ...baseData,
  paymentMethod: PaymentMethod.Pix,
  merchantInvoiceId: "MERCHANT_INVOICE_ID_DEPOSIT",
};

const screeningData = {
  ...baseData,
  merchantInvoiceId: "MERCHANT_INVOICE_ID_WITHDRAWAL",
  merchantId: process.env.PAY4FUN_MERCHANT_ID,
  targetCustomerMainId: "TARGET_CUSTOMER_MAIN_ID",
  targetCustomerEmail: "TARGET_CUSTOMER_EMAIL",
  fullName: "FULL NAME",
  targetCustomerBirthDate: "1990-05-31",
  targetCustomerPhoneNumberCountryCode: "55",
  targetCustomerPhoneNumberAreaCode: "11",
  targetCustomerPhoneNumber: "987654321",
};

const extraData = {
  notOkUrl: process.env.PAY4FUN_NOT_OK_URL,
  okUrl: process.env.PAY4FUN_OK_URL,
  confirmationUrl: process.env.PAY4FUN_CONFIRMATION_URL,
  language: "pt-BR",
  layoutColor: undefined,
  merchantLogo: undefined,
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

const screeningConfirmationPayload = {
  TransactionId: "TRANSACTION_ID",
  Amount: 20,
  FeeAmount: 0,
  MerchantInvoiceId: "MERCHANT_INVOICE_ID",
  Currency: "BRL",
  Status: "201",
  LiquidationDate: "2023-02-25",
  Message: "",
  CustomerEmail: "CUSTOMER@MAIL.COM",
  Hash: "VALID_HASH",
  Process: "Screening",
} satisfies PayOutConfirmationPayload;

const requestHeaders = {
  "Content-Type": "application/json",
  merchantId: process.env.PAY4FUN_MERCHANT_ID,
  hash: "GENERATED_HASH",
};

describe("Pay4FunService", () => {
  let pay4FunService: Pay4FunService;

  beforeEach(() => {
    mockAxios.reset();

    pay4FunService = new Pay4FunService({
      url: process.env.PAY4FUN_API_URL,
      merchantId: process.env.PAY4FUN_MERCHANT_ID,
      merchantKey: process.env.PAY4FUN_MERCHANT_KEY,
      merchantSecret: process.env.PAY4FUN_MERCHANT_SECRET,
      okUrl: process.env.PAY4FUN_OK_URL,
      notOkUrl: process.env.PAY4FUN_NOT_OK_URL,
      confirmationUrl: process.env.PAY4FUN_CONFIRMATION_URL,
    });
  });

  it("should make a request to pay4fun for deposit", () => {
    jest
      .spyOn(pay4FunService, "generateHash")
      .mockReturnValue(requestHeaders.hash);

    pay4FunService.deposit(depositData);

    expect(mockAxios).toBeCalledWith({
      method: "POST",
      url: `${process.env.PAY4FUN_API_URL}/1.0/go/process/`,
      data: {
        ...depositData,
        ...extraData,
      },
      headers: requestHeaders,
    });
  });

  it("should fail if deposit response code from Pay4Fun is different than 200", () => {
    jest
      .spyOn(pay4FunService, "generateHash")
      .mockReturnValue(requestHeaders.hash);

    const response = {
      code: HttpStatus.BAD_REQUEST,
      message: "Falha no depósito.",
    };

    const request = pay4FunService.deposit(depositData);

    mockAxios.mockResponse({
      data: response,
    });

    expect(request).resolves.toEqual({
      error: true,
      statusCode: HttpStatus.BAD_REQUEST,
      message: response.message,
      data: null,
    });
  });

  it("should make a request to pay4fun for screening", () => {
    const generateHashMock = jest
      .spyOn(pay4FunService, "generateHash")
      .mockReturnValue(requestHeaders.hash);

    pay4FunService.screening(screeningData);

    const fixedAmount = currency(screeningData.amount).intValue;

    expect(generateHashMock).toBeCalledWith(
      `${screeningData.merchantId}${fixedAmount}${screeningData.merchantInvoiceId}${screeningData.targetCustomerEmail}${process.env.PAY4FUN_MERCHANT_SECRET}`
    );

    expect(mockAxios).toBeCalledWith({
      method: "POST",
      url: `${process.env.PAY4FUN_API_URL}/1.0/goout/screening/`,
      data: {
        ...screeningData,
        ...extraData,
        hash: requestHeaders.hash,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
  });

  it("should fail if checkTransaction is called with invalid sign", async () => {
    jest.clearAllMocks();

    const response = await pay4FunService.checkTransaction({
      ...confirmationPayload,
      Amount: 100,
    });

    expect(response).toEqual({
      error: true,
      statusCode: HttpStatus.OK,
      status: TransactionStatus.FAILED,
      message: "Assinatura inválida.",
    });
  });

  it("should pass if checkTransaction is called with valid sign deposit", async () => {
    jest.clearAllMocks();

    const generateHashMock = jest
      .spyOn(pay4FunService, "generateHash")
      .mockReturnValue(confirmationPayload.Sign);

    const response = await pay4FunService.checkTransaction({
      ...confirmationPayload,
      Message: "success",
    });

    const fixedAmount = currency(confirmationPayload.Amount).intValue;

    expect(generateHashMock).toBeCalledWith(
      `${process.env.PAY4FUN_MERCHANT_ID}${fixedAmount}${confirmationPayload.MerchantInvoiceId}${confirmationPayload.Status}`
    );

    expect(response).toEqual({
      error: false,
      statusCode: HttpStatus.OK,
      status: TransactionStatus.SUCCESS,
      message: "Transação confirmada.",
    });
  });

  it("should pass if checkTransaction is called with valid Hash screening", async () => {
    jest.clearAllMocks();

    const generateHashMock = jest
      .spyOn(pay4FunService, "generateHash")
      .mockReturnValue(screeningConfirmationPayload.Hash);

    const response = await pay4FunService.checkTransaction(
      screeningConfirmationPayload
    );

    const fixedAmount = currency(screeningConfirmationPayload.Amount).intValue;

    expect(generateHashMock).toBeCalledWith(
      `${process.env.PAY4FUN_MERCHANT_ID}${fixedAmount}${screeningConfirmationPayload.MerchantInvoiceId}${screeningConfirmationPayload.CustomerEmail}`
    );

    expect(response).toEqual({
      error: false,
      statusCode: HttpStatus.PROCESSING,
      status: TransactionStatus.PENDING,
      message: "Transação pendente.",
    });
  });
});
