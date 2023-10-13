import { useState } from "react";
import axios from "axios";
import { isPay4FunDepositResponse } from "services/Pay4Fun/types";
import { GatewayType } from "types/GatewayService";
import { CashipTransactionStatus, isCashipDepositResponse } from "types/caship";
import { taskInterval } from "utils/taskInterval";
import { doToast } from "utils/toastOptions";
import { PaymentDepositResponse, StatusPayment } from "../";
import { sendForCS } from "./sendForCS";
import { HAS_BONUS, HAS_CUSTOMER_SERVICE } from "../../../../constants";
import { useModal } from "@/hooks/useModal";
import { useBtag } from "@/hooks/useBtag";
import useFunctions from "./useFunctions";
import Cookies from "js-cookie";
import { useDataLayer } from "./useDataLayer";
import { useSession } from "@/hooks/useSession";

export default function useProcessDeposit() {
  const { getBtagFromCookie } = useBtag();
  const { sendDataLayer, account, roles } = useDataLayer();
  const { close } = useModal();
  const { getPaymentStatus, redirectToThankYouPage } = useFunctions();
  const [content, setContent] = useState<
    "Default" | "Error" | "Success" | "QrCode" | "Redirect"
  >("Default");
  const [pixPaymentCode, setPixPaymentCode] = useState("");
  const [qrCodeImage, setQrCodeImage] = useState("");
  const [redirectTo, setRedirectTo] = useState<null | string>(null);
  const [payment, setPayment] = useState<
    | {
        status: StatusPayment;
        message: string;
      }
    | undefined
  >();
  const { sessionId } = useSession();

  async function checkFirstTimeDeposit() {
    const res = await axios.post("/api/payments/history/count", {
      sessionId,
      type: 'deposits'
    });

    const count = Number(res.data.count);

    const isFtd = count === 0;

    return isFtd;
  }

  async function trackPaymentEvent(depositAmount, bonusCode, gateway) {
    const isFtd = await checkFirstTimeDeposit();
  
    sendDataLayer(
      isFtd ? "ftd-confirmed" : "payment-confirmed",
      depositAmount,
      gateway,
      bonusCode
    );
  }

  function handleInvalidBonusCode() {
    setContent("Default");
    doToast("Cupom inválido ou expirado!");
  }

  async function performDeposit(values, bonusCode, sessionId, userId) {
    const gatewayType = values.gatewayType as GatewayType;
    return await axios.post<PaymentDepositResponse>("/api/payments/deposit", {
      gatewayType,
      sessionId,
      userId,
      amount: values.depositAmount,
      bonusCode: bonusCode || null,
    });
  }

  function handleDepositResponse(depositResponse, values) {
    const { data } = depositResponse.data;

    sendDataLayer(
      "pix-generated",
      values.depositAmount,
      values.gatewayType,
      values.bonusCode,
    );

    if (
      isPay4FunDepositResponse(data) &&
      values.gatewayType === GatewayType.PAY4FUN
    ) {
      handlePay4FunResponse(values, data);
    } else if (
      isCashipDepositResponse(data) &&
      values.gatewayType === GatewayType.CASHIP
    ) {
      handleCashipResponse(values, data);
    } else if (values.gatewayType === GatewayType.PAAG) {
      handlePaagResponse(values, data);
    }
  }

  function handlePay4FunResponse(values, data) {
    if (data?.url) {
      setContent("Redirect");
      setRedirectTo(data.url);
    } else {
      setContent("Error");
    }
  }

  async function handleCashipResponse(values, data) {
    setQrCodeImage(data.pix_qrcode_url);
    setPixPaymentCode(data.pix_copiacola);
    setContent("QrCode");

    const CANCELED_STATUS = ["3", "4", "5"];

    await taskInterval({
      duration: 300000, // 5 minutes
      interval: 10 * 1000, // 10 seconds
      task: async (success, error) => {
        try {
          const paymentStatusResponse = await getPaymentStatus(
            data.partner_order_number,
            GatewayType.CASHIP,
          );
          const paymentStatusResponseData = paymentStatusResponse.data;

          if (
            CANCELED_STATUS.includes(
              paymentStatusResponseData.order_status_id.toString(),
            )
          ) {
            error();
          }

          if (
            paymentStatusResponseData.order_status_id ===
            CashipTransactionStatus.approved
          ) {
            success();
          }
        } catch (error) {
          // ignore error, as network instability issues can occur,
          // it continues to execute until the final time or water
        }
      },
    });

    Cookies.remove(HAS_BONUS);
    setContent("Success");
    setPayment({
      status: StatusPayment.SUCCESS,
      message: "Depósito realizado com sucesso!",
    });

    await trackPaymentEvent(values.depositAmount, values.bonusCode, GatewayType.CASHIP)

    const customerServiceCookie = Cookies.get(HAS_CUSTOMER_SERVICE);
    if (customerServiceCookie) {
      const customerServiceParam = JSON.parse(customerServiceCookie);
      await sendForCS(
        account.username,
        customerServiceParam,
        values.depositAmount,
      );
    }

    close();
    const btag = getBtagFromCookie();
    redirectToThankYouPage(btag);
  }

  async function handlePaagResponse(values, data) {
    const response = data.transaction.events[0];
    setQrCodeImage(response.qrcode_image);
    setPixPaymentCode(response.qrcode);
    setContent("QrCode");

    await taskInterval({
      duration: 300000, // 5 minutes
      interval: 10 * 1000, // 10 seconds
      task: async (success, error) => {
        try {
          const paymentStatusResponse = await getPaymentStatus(
            data.transaction.id,
            GatewayType.PAAG,
          );

          if (paymentStatusResponse.status === "SUCCESS") {
            success();
          }
        } catch (error) {
          // ignore error, as network instability issues can occur,
          // it continues to execute until the final time or water
        }
      },
    });

    Cookies.remove(HAS_BONUS);
    setContent("Success");
    setPayment({
      status: StatusPayment.SUCCESS,
      message: "Depósito realizado com sucesso!",
    });

    await trackPaymentEvent(values.depositAmount, values.bonusCode, GatewayType.PAAG)

    const customerServiceCookie = Cookies.get(HAS_CUSTOMER_SERVICE);
    if (customerServiceCookie) {
      const customerServiceParam = JSON.parse(customerServiceCookie);
      await sendForCS(
        account.username,
        customerServiceParam,
        values.depositAmount,
        );
      }
      
    close();
    const btag = getBtagFromCookie();
    redirectToThankYouPage(btag);
  }

  function handlePaymentError(error) {
    setContent("Error");

    if (error?.response?.data.message) {
      setPayment({
        status: StatusPayment.ERROR,
        message: error.response?.data.message,
      });
    } else {
      setPayment({
        status: StatusPayment.ERROR,
        message: error ?? "Tempo para realizar o pagamento expirou.",
      });
    }
  }

  return {
    payment,
    pixPaymentCode,
    qrCodeImage,
    redirectTo,
    content,
    setContent,
    handleInvalidBonusCode,
    performDeposit,
    handleDepositResponse,
    handlePay4FunResponse,
    handlePaymentError,
  };
}
