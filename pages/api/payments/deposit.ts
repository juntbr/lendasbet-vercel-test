import * as Sentry from "@sentry/node";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuid } from "uuid";

import dayjs from "utils/dayjs";
import { validate } from "../middleware/validate";
import { gamMatrixErrorMessages } from "./gamMatrixErrorMessages";

import { formatDataToPartner } from "services/Caship/formatDataToPartner";
import { FirebaseService } from "services/FirebaseService";
import { GamMatrix } from "services/GamMatrix";
import { GetUserDetails } from "services/GamMatrix/GetUserDetails";
import { IsActiveUserSession } from "services/GamMatrix/isActiveUserSession";
import { GatewayService, GatewayType } from "services/GatewayService";
import GetUserIp from "services/GetUserIp";

import { CashipService } from "services/Caship";
import { PaagService } from "services/Paag";
import { Pay4FunService } from "services/Pay4Fun";
import { depositSchema } from "../../../schemas/api/deposit";

const firebaseService = new FirebaseService();

const cashipService = new CashipService({
  url: process.env.CASHIP_API_URL,
  token: process.env.CASHIP_BASIC_AUTH,
});

const pay4funService = new Pay4FunService({
  url: process.env.PAY4FUN_API_URL,
  merchantId: process.env.PAY4FUN_MERCHANT_ID,
  merchantKey: process.env.PAY4FUN_MERCHANT_KEY,
  merchantSecret: process.env.PAY4FUN_MERCHANT_SECRET,
  okUrl: process.env.PAY4FUN_OK_URL,
  notOkUrl: process.env.PAY4FUN_NOT_OK_URL,
  confirmationUrl: process.env.PAY4FUN_CONFIRMATION_URL,
  merchantLogo: process.env.PAY4FUN_MERCHANT_LOGO,
  layoutColor: process.env.PAY4FUN_LAYOUT_COLOR,
});

const paagService = new PaagService();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body;

  const sessionId = body.sessionId;

  let gatewayService;

  if (body.gatewayType === GatewayType.PAY4FUN) {
    gatewayService = new GatewayService({ currentGateway: pay4funService });
  } else if (body.gatewayType === GatewayType.CASHIP) {
    gatewayService = new GatewayService({ currentGateway: cashipService });
  } else if (body.gatewayType === GatewayType.PAAG) {
    gatewayService = new GatewayService({ currentGateway: paagService });
  }

  const { isActive, userId } = await IsActiveUserSession(sessionId);

  if (!isActive) {
    return res.status(500).json({ message: "Invalid session" });
  }

  const userDetails = await GetUserDetails(sessionId);

  const userIp = (await GetUserIp(req)).ip;

  const bonusCode = body?.bonusCode?.toUpperCase() ?? "";

  const gamMatrixResponse = await GamMatrix("checkdeposittrans", {
    sessionId,
    userId,
    requestAmount: body.amount,
    requestCurrency: "BRL",
    userIp,
    applyBonusCode: bonusCode ?? undefined,
  });

  if (gamMatrixResponse.error || !gamMatrixResponse.data.success) {
    const message = gamMatrixErrorMessages(
      gamMatrixResponse.data?.errorData?.errorCode.toString(),
    );
    return res.status(gamMatrixResponse.status).json({
      error: true,
      data: gamMatrixResponse.data,
      message: message + " EMGL-1",
    });
  }

  const birthDate = userDetails.birthDate.split(" ")[0];

  const hasMobile = !!userDetails.mobile;

  const mobile = hasMobile ? userDetails.mobile : userDetails.phone;

  const name = userDetails.firstName
    ? `${userDetails.firstName} ${userDetails.lastName}`
    : userDetails.alias;

  const transactionId = `DEPOSIT_${uuid()}_GATEWAY_${body.gatewayType}`;

  try {
    const params = {
      partner_user_uid: userId,
      partner_user_name: name,
      partner_user_email: userDetails.email,
      partner_user_document: userDetails.personalId,
      partner_user_birthday: birthDate,
      partner_user_zipcode: userDetails.zip,
      partner_user_mobile: mobile,
      partner_order_number: transactionId,
      partner_order_amount: body.amount,
      partner_order_method: 5,
      partner_order_group: 1,
    };

    const gatewayResponse = await gatewayService.deposit({
      type: body.gatewayType,
      params,
    });

    if (gatewayResponse.error) {
      const { statusCode, error, data, message } = gatewayResponse;

      return res.status(Number(statusCode)).json({ error, data, message });
    }

    const partnerData = formatDataToPartner({
      userDetails,
      amount: body.amount,
      orderNumber: gatewayResponse.data.transactionId,
      userId,
    });

    const transactionInfo = {
      ...partnerData,
      transactionId: gatewayResponse.data.transactionId,
      bonusCode: bonusCode ?? null,
      created_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      updated_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    };

    const depositFirebase = await firebaseService.deposit(
      transactionId,
      transactionInfo,
    );

    if (depositFirebase.error) {
      Sentry.captureException(depositFirebase.data);
    }

    return res
      .status(200)
      .json({ error: false, data: { ...gatewayResponse.data }, message: "" });
  } catch (error) {
    Sentry.captureException(error);

    return res.status(400).json({
      error,
      data: error.data,
      message: "Falha ao realizar depósito. GE-1",
    });
  }
};

export default validate(depositSchema, handler);
