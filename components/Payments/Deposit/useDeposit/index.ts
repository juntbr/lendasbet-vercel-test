/* eslint-disable camelcase */
import useEventTracker from "@/hooks/useEventTracker";
import { useAuth } from "hooks/useAuth";
import Cookies from "js-cookie";
import { useEffect, useMemo, useState } from "react";
import incompleteProfile, {
  incompleteProfileRole,
} from "utils/incompleteProfile";
import useFunctions from "./useFunctions";
import { useDataLayer } from "./useDataLayer";
import useProcessDeposit from "./useProcessDeposit";
import { HAS_BONUS } from "../../../../constants";

type PaymentLogicProps = {
  setValue?: any;
};

export default function useDeposit({ setValue = (x) => x }: PaymentLogicProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { userId, sessionId } = useAuth();

  const { sendDataLayer, account, roles } = useDataLayer();
  const { trackerDeposit, validateBonusCode } = useFunctions();
  const { appendParamByEventName } = useEventTracker();
  const {
    handleInvalidBonusCode,
    performDeposit,
    handleDepositResponse,
    handlePaymentError,
    payment,
    content,
    pixPaymentCode,
    qrCodeImage,
    redirectTo,
  } = useProcessDeposit();

  const isProfileIncomplete = useMemo(() => {
    return incompleteProfile(account) || incompleteProfileRole(roles);
  }, [account, roles]);

  useEffect(() => {
    const EVENT_NAME = "open-deposit";
    appendParamByEventName(EVENT_NAME, true);
    sendDataLayer(EVENT_NAME);

    const coupon = Cookies.get(HAS_BONUS);

    if (coupon) setValue("bonusCode", coupon);
  }, []);

  async function handleGeneratePayment(values, bonusCodeParam) {
    setIsLoading(true);

    try {
      const bonusCode = values.bonusCode?.trim() || bonusCodeParam;

      if (bonusCode) {
        const bonusValidationResponse = await validateBonusCode(bonusCode);
        if (bonusValidationResponse.error) {
          handleInvalidBonusCode();
          return;
        }
      }

      trackerDeposit(values.depositAmount);

      const depositResponse = await performDeposit(
        values,
        bonusCode,
        sessionId,
        userId,
      );

      handleDepositResponse(depositResponse, values);
    } catch (error) {
      handlePaymentError(error);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    payment,
    content,
    pixPaymentCode,
    qrCodeImage,
    redirectTo,
    isProfileIncomplete,
    handleGeneratePayment,
    isLoading,
  };
}
