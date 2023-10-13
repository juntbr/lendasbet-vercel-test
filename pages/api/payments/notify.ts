import * as Sentry from "@sentry/node";
import currency from "currency.js";
import HttpStatus from "http-status";
import { Redis } from "ioredis";
import { appendToExistingS3File } from "server/helpers/saveToS3";
import { sendToCustomerService } from "server/usecases/customer-service/send-to-cs";
import { CashipService } from "services/Caship";

import { FirebaseService } from "services/FirebaseService";
import { GamMatrix } from "services/GamMatrix";
import { GatewayService } from "services/GatewayService";
import GetUserIp from "services/GetUserIp";
import { PaagService } from "services/Paag";
import { isPaagConfirmationPayload } from "services/Paag/types";
import { Pay4FunService } from "services/Pay4Fun";
import { isPayInConfirmationPayload, isPayOutConfirmationPayload } from "services/Pay4Fun/types";
import ReferFriendApi from "services/referFriendApi";
import { ReferFriendDepositType } from "services/referFriendApi/types";
import { TransactionStatus } from "types/GatewayService";
import { CashipTransactionStatus, isCashipConfirmation } from "types/caship";
import logger from "utils/logger";

const redisClient = new Redis(
  process.env.CUSTOMER_SERVICE_UPSTASH_REDIS_API_URI,
);

const cashipService = new CashipService({
  url: process.env.CASHIP_API_URL,
  token: process.env.CASHIP_BASIC_AUTH,
});

const pay4FunService = new Pay4FunService({
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

const firebaseService = new FirebaseService();

const paagService = new PaagService();

function transformByGateway(gateway, body): number {
  if(gateway === 'CASHIP') {
    return Number(body.order_status_id);
  }

  if(gateway === 'PAY4FUN') {
    if(body.status === 201) return 7
    return 4;
  }
  if(gateway === 'PAAG'){
    const events = body.transaction?.events;
    if(events.length === 0) {
      return 4;
    }

    const event = events[0]

    if(event.event_type === 'capture' && event.success) return 7;
    
    return 4;
  }

  return 4;
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    const body = req.body;

    try {
      let transactionId = body?.partner_order_number ?? body?.MerchantInvoiceId;
      if (isPaagConfirmationPayload(body)) {
        transactionId = body?.transaction.merchant_transaction_id;
      }
      
      if (transactionId?.includes("DEPOSIT")) {
        let currentGateway = null;
        
        if (isCashipConfirmation(body)) {
          if(body.order_status_id === CashipTransactionStatus.approved && transactionId.includes("DEPOSIT")){
            appendToExistingS3File(body);
          }
          currentGateway = cashipService;
        }
        
        if (isPayInConfirmationPayload(body)) {
          currentGateway = pay4FunService;
        }
        
        if (isPaagConfirmationPayload(body)) {
          currentGateway = paagService;
        }
        
        const gatewayService = new GatewayService({
          currentGateway,
        });
        // TODO adicionar checagem do  HEADER 'partner-key',
        const responseCheckTransaction =
        await gatewayService.checkTransaction(body);
        
        const gateway = () => {
          if (isCashipConfirmation(body)) {
            return "CASHIP";
          }
          
          if (isPayInConfirmationPayload(body) || isPayOutConfirmationPayload(body)) {
            return "PAY4FUN";
          }
          
          if (isPaagConfirmationPayload(body)) {
            return "PAAG";
          }
        }; 
          
        if (responseCheckTransaction.status !== TransactionStatus.SUCCESS) {
          await firebaseService.updateDepositByTransactionId(transactionId, {
            orderStatus: transformByGateway(gateway, body)// tratar p4f, caship, paag
          })
          return res.status(HttpStatus.OK).end();
        }

        const deposit =
          await firebaseService.findDepositByTransactionId(transactionId);

        if (deposit === null) {
          return res.status(200).json({
            message: "Transaction not found",
          });
        }

        let requestAmount = currency(deposit.partner_order_amount).toString();

        const bodyAmout = currency(body.Amount).toString();
        const savedAmout = currency(deposit.partner_order_amount).toString();
        if (body?.Amount !== undefined && bodyAmout !== savedAmout) {
          // TODO atualizar no firestore o valor do deposito
          requestAmount = currency(body.Amount).toString();
        }

        const userIp = (await GetUserIp(req)).ip;

        await firebaseService.updateDepositByTransactionId(transactionId, {
          orderStatus: transformByGateway(gateway, body)// tratar p4f, caship, paag
        })

        try {
          await GamMatrix("deposit", {
            version: "1.0",
            partnerID: process.env.GAMMATRIX_API_SITE_ID,
            partnerKey: process.env.GAMMATRIX_API_SITE_CODE,
            userId: deposit.partner_user_uid,
            requestAmount,
            requestCurrency: "BRL",
            transactionReference: deposit.partner_order_number,
            userIp,
            applyBonusCode: deposit.bonusCode ?? undefined,
          });

          const hasCustomerService = await redisClient.get(
            deposit.partner_user_uid,
          );

          const customerServiceData = JSON.parse(hasCustomerService);

          const createCustomerService = {
            depositValue: requestAmount,
            ...customerServiceData,
          };

          if (hasCustomerService) {
            await sendToCustomerService(createCustomerService);
            await redisClient.del(deposit.partner_user_uid);
          }

          await ReferFriendApi.deposit({
            type: ReferFriendDepositType.GAMMATRIX,
            version: "1.0",
            partnerID: process.env.GAMMATRIX_API_SITE_ID,
            partnerKey: process.env.GAMMATRIX_API_SITE_CODE,
            requestAmount: deposit.partner_order_amount,
            requestCurrency: "BRL",
            transactionReference: deposit.partner_order_number,
            userId: deposit.partner_user_uid,
            userIp,
            token: process.env.RAF_API_TOKEN,
          });

          logger.info(
            `${gateway} - DEPOSIT SUCCESS ${transactionId}: ` +
              JSON.stringify({
                version: "1.0",
                userId: deposit.partner_user_uid,
                requestAmount,
                requestCurrency: "BRL",
                transactionReference: deposit.partner_order_number,
                userIp,
                applyBonusCode: deposit.bonusCode ?? undefined,
              }),
          );
        } catch (error) {
          logger.error(
            `${gateway} - DEPOSIT REJECTED ${transactionId}: ` +
              JSON.stringify(error),
          );
          Sentry.captureException(error);
        }

        return res.status(200).end();
      }

      if (transactionId?.includes("WITHDRAW")) {
        let currentGateway = null;

        if (isCashipConfirmation(body)) {
          currentGateway = cashipService;
        }

        if (isPayOutConfirmationPayload(body)) {
          currentGateway = pay4FunService;
        }

        if (isPaagConfirmationPayload(body)) {
          currentGateway = paagService;
        }

        const gatewayService = new GatewayService({
          currentGateway,
        });

        const checkTransaction = await gatewayService.checkTransaction(body);

        if (checkTransaction.status === TransactionStatus.FAILED) {
          const withdraw = await firebaseService.findWithdrawByPartnerOrderNumber(
              transactionId,
            );

          let message = "";

          if (withdraw) {
            firebaseService.updateWithdrawByTransactionId(
              withdraw.transactionId,
              {
                orderStatus: CashipTransactionStatus.canceled,
              },
            );

            message = checkTransaction.message;

            Sentry.captureMessage(
              `[NOTIFY]Error message:"
                ${message}
                ${JSON.stringify({
                  error: checkTransaction.error,
                })}`,
            );

            const userIp = (await GetUserIp(req)).ip;

            const deposit = {
              version: "1.0",
              partnerID: process.env.GAMMATRIX_API_SITE_ID,
              partnerKey: process.env.GAMMATRIX_API_SITE_CODE,
              userId: withdraw.partner_user_uid,
              requestAmount: withdraw.partner_order_amount,
              requestCurrency: "BRL",
              transactionReference: withdraw.partner_order_number + "-ROLLBACK",
              userIp,
              note: `ROLLBACK ${withdraw.partner_user_uid}, making a deposit to user #${withdraw.partner_user_uid}, error returned: ${message}`,
            };

            const gamMatrixResponse = await GamMatrix("deposit", deposit);

            if (gamMatrixResponse.error) {
              Sentry.captureMessage(
                "GamMatrix error after ROLLBACK: - " +
                  JSON.stringify({
                    depositData: deposit,
                    errorData: gamMatrixResponse.data,
                  }),
              );
            }
          }

          return res
            .status(HttpStatus.OK)
            .json({ error: true, data: null, message });
        }

        if (body.status !== "pending") {
          await firebaseService.updateWithdrawByTransactionId(transactionId, {
            orderStatus: body.status,
          });
        }

        return res.status(200).end();
      }
    } catch (error) {
      Sentry.captureException(error);
      return res.status(500).end();
    }
  }

  return res.status(200).end();
}
