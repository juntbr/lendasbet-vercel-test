import { GatewayType } from "types/GatewayService";
import { number, object, string, mixed } from "yup";

export const depositSchema = object({
  gatewayType: mixed<GatewayType>()
    .oneOf(Object.values(GatewayType))
    .default(GatewayType.CASHIP)
    .required(),
  sessionId: string().required(),
  userId: number().required(),
  amount: string().required(),
  bonusCode: string().nullable(),
});
