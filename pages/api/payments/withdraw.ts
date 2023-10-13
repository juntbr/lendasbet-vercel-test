import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuid } from "uuid";
import * as Sentry from "@sentry/node";
import { doc, setDoc } from "firebase/firestore";

import dayjs from "utils/dayjs";
import { firestore } from "utils/clientApp";
import GetUserIp from "services/GetUserIp";
import { GetUserDetails } from "services/GamMatrix/GetUserDetails";
import { formatDataToPartner } from "services/Caship/formatDataToPartner";
import { IsActiveUserSession } from "services/GamMatrix/isActiveUserSession";
import { GetUserAccounts } from "services/GamMatrix/GetUserAccounts";
import { GamMatrix } from "services/GamMatrix";
import { validate } from "../middleware/validate";

import {
  CASINO_WALLET_LOCKED_BY_ROLLOVER_BONUS_ERROR_MESSAGE,
  EXTERNAL_CASHIER_CREDIT_PAY_CARD_VENDOR_ID,
} from "constants/everyMatrix";
import { gamMatrixErrorMessages } from "./gamMatrixErrorMessages";
import { CashipTransactionStatus } from "types/caship";
import { withdrawSchema } from "schemas/api/withdraw";

interface GamMatrixWithdrawResponse {
  balanceAmount: string | null;
  errorData: {
    errorCode: number;
    errorDetails: string[];
    errorMessage: string;
    logId: number;
  };
  success: 1 | 2;
  timestamp: string;
  transStatus: number;
  transactionId: null;
  version: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const { gatewayType, sessionId, amount, pixtype, pixkey } = req.body;

      const { isActive, userId } = await IsActiveUserSession(sessionId);

      if (isActive) {
        const userIp = (await GetUserIp(req)).ip;

        const getUserAccounts = await GetUserAccounts(sessionId);

        if (getUserAccounts) {
          const transactionReference = `WITHDRAW_${uuid()}_GATEWAY_${gatewayType}`;

          const casinoAccount = getUserAccounts.accounts.find(
            (account) => account.displayName === "Casino",
          );

          const gamMatrixResponse = await GamMatrix<GamMatrixWithdrawResponse>(
            "withdraw",
            {
              sessionId,
              requestAmount: amount,
              requestCurrency: "BRL",
              transactionReference,
              debitAccountId: casinoAccount.id,
              creditPayCardVendorId: EXTERNAL_CASHIER_CREDIT_PAY_CARD_VENDOR_ID,
              userIp,
            },
          );
          
          // Se o saque pode ser realizado
          if (gamMatrixResponse.data?.errorData?.errorCode === 0) {
            const userDetails = await GetUserDetails(sessionId);

            const transactionId = gamMatrixResponse.data.transactionId;

            const partnerData = formatDataToPartner({
              userDetails,
              amount,
              orderNumber: transactionReference,
              userId,
            });

            // TODO Save in firebase
            const transactionInfo = {
              ...partnerData,
              partner_withdraw_pixtype: pixtype,
              partner_withdraw_pixkey: pixkey,
              transactionId,
              orderStatus: CashipTransactionStatus.pending,
              created_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
              updated_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            };

            console.log("transactionId", transactionInfo.transactionId);

            // withdraws/transactionId
            const _withdraw = doc(firestore, `withdraws/${transactionId}`);

            try {
              await setDoc(_withdraw, transactionInfo);
            } catch (e) {
              console.error("Error adding document: ", e);
            }

            const data = {};

            return res.status(200).json({
              error: false,
              data,
              message: "Sua solicitação de saque foi enviada com sucesso.",
            });
          } else {
            Sentry.captureMessage(
              `New withdraw gamMatrix withdraw error: ${JSON.stringify(
                gamMatrixResponse,
              )}`,
            );
            let message = gamMatrixErrorMessages(
              gamMatrixResponse.data.errorData.errorCode.toString(),
            );

            if (
              gamMatrixResponse.data.errorData.errorMessage ===
              CASINO_WALLET_LOCKED_BY_ROLLOVER_BONUS_ERROR_MESSAGE
            ) {
              message = "Cumpra as regras de Rollover antes de efetuar o saque";
            }

            return res.status(400).json({ error: true, message });
          }
        }

        return res.status(400).end();
      }

      return res.status(403).end();
    } catch (error) {
      return res
        .status(200)
        .json(error.response?.data ?? { message: "GENERIC-ERROR" });
    }
  } else {
    return res.status(404).end();
  }
};

export default validate(withdrawSchema, handler);
