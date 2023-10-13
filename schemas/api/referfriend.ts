import { object, string } from "yup";

export const referFriendSchema = object({
  partnerUserId: string().required(),
  usedReferCode: string().nullable(),
});
