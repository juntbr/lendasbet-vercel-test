import { describe, expect } from "@jest/globals";
import HttpStatus from "http-status";

import { CurrentCode } from "constants/currency";

import { CashipService } from "services/Caship/CashipService";
import { Pay4FunService } from "services/Pay4Fun";

jest.mock("services/Caship", () => ({
  CashipApi: jest.fn(() => {
    return Promise.resolve({
      error: false,
      data: {},
      status: HttpStatus.OK,
    });
  }),
}));

import { GatewayService, GatewayType } from ".";

const depositData = {
  partner_user_uid: "USER_ID",
  partner_user_name: "USER_NAME",
  partner_user_email: "USER_EMAIL",
  partner_user_document: "USER_DOCUMENT",
  partner_user_birthday: "USER_BIRTHDAY",
  partner_user_zipcode: "USER_ZIPCODE",
  partner_user_mobile: "USER_MOBILE",
  partner_order_number: "ORDER_NUMBER",
  partner_order_amount: "10",
  partner_order_method: 5,
  partner_order_group: 1,
};

describe("GatewayService", () => {
  let gatewayService: GatewayService;

  beforeEach(() => {
    gatewayService = new GatewayService();

    jest.clearAllMocks();
  });

  it("should call CashipService if type is equal CASHIP", async () => {
    const cashipServiceDeposit = jest
      .spyOn(CashipService.prototype, "deposit")
      .mockResolvedValue({
        error: false,
        statusCode: HttpStatus.OK,
        data: null,
        message: null,
      });

    await gatewayService.deposit({
      type: GatewayType.CASHIP,
      params: depositData,
    });

    expect(cashipServiceDeposit).toHaveBeenCalledWith(depositData);
  });

  it("should call Pay4FunService if type is equal PAY4FUN", async () => {
    const depositDataPay4Fun = {
      amount: depositData.partner_order_amount,
      currency: CurrentCode.BRL,
      merchantInvoiceId: depositData.partner_order_number,
      okUrl: undefined,
      notOkUrl: undefined,
      confirmationUrl: undefined,
    };

    const pay4FunServiceDeposit = jest
      .spyOn(Pay4FunService.prototype, "deposit")
      .mockResolvedValue({
        error: false,
        statusCode: 400,
        message: null,
        data: null,
      });

    await gatewayService.deposit({
      type: GatewayType.PAY4FUN,
      params: depositData,
    });

    expect(pay4FunServiceDeposit).toHaveBeenCalledWith(depositDataPay4Fun);
  });

  it("should call CashipService.isConfirmation", async () => {
    const REQUEST_PAYLOAD = {
      partner_order_amount: "ORDER_AMOUNT",
    };

    const cashipServiceCheckTransaction = jest
      .spyOn(CashipService.prototype, "checkTransaction")
      .mockResolvedValue(null);

    await gatewayService.checkTransaction(REQUEST_PAYLOAD);

    expect(cashipServiceCheckTransaction).toHaveBeenCalledWith(REQUEST_PAYLOAD);
  });

  it("should call Pay4FunService.isConfirmation", async () => {
    const REQUEST_PAYLOAD = {
      MerchantInvoiceId: "MERCHANT_INVOICE_ID",
    };

    const cashipServiceCheckTransaction = jest
      .spyOn(Pay4FunService.prototype, "checkTransaction")
      .mockResolvedValue(null);

    await gatewayService.checkTransaction(REQUEST_PAYLOAD);

    expect(cashipServiceCheckTransaction).toHaveBeenCalledWith(REQUEST_PAYLOAD);
  });
});
