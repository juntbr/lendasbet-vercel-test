import { GetUserDetailsResponse } from "services/GamMatrix/GetUserDetails";
import dayjs from "utils/dayjs";

interface FormatDataToPartnerParams {
  userDetails: GetUserDetailsResponse;
  userId: string;
  orderNumber: string;
  amount: string;
}

export function formatDataToPartner(params: FormatDataToPartnerParams) {
  const { userDetails, userId, orderNumber, amount } = params;

  const hasMobile = !!userDetails.mobile;

  const mobile = hasMobile ? userDetails.mobile : userDetails.phone;

  const name = userDetails.firstName
    ? `${userDetails.firstName} ${userDetails.lastName}`
    : userDetails.userName;

  return {
    partner_user_uid: userId,
    partner_user_name: name,
    partner_user_email: userDetails.email,
    partner_user_document: userDetails.personalId,
    partner_user_birthday: dayjs(userDetails.birthDate).format("YYYY-MM-DD"),
    partner_user_zipcode: userDetails.zip,
    partner_user_mobile: mobile,
    partner_order_number: orderNumber,
    partner_order_amount: amount,
    partner_order_method: 5,
    partner_order_group: 1,
  };
}
