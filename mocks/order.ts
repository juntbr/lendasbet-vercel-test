import { USER_DETAILS, USER_ID } from "./user";

export const UUID = "a18c5e27-e1b0-4a39-bd5c-4fa40a881b6b";

export const TRANSACTION_ID = `DEPOSIT_${UUID}`;
export const TRANSACTION_WITHDRAW_ID = `WITHDRAW_${UUID}`;

//tratamento de dados
const birthDate = USER_DETAILS.birthDate.split(" ")[0];
const name = `${USER_DETAILS.firstName} ${USER_DETAILS.lastName}`;

export const ORDER = {
  partner_user_uid: USER_ID,
  partner_user_name: name,
  partner_user_email: USER_DETAILS.email,
  partner_user_document: USER_DETAILS.personalId,
  partner_user_birthday: birthDate,
  partner_user_zipcode: USER_DETAILS.zip,
  partner_user_mobile: USER_DETAILS.mobile,
  partner_order_number: TRANSACTION_ID,
  partner_order_amount: "10.00",
  partner_order_method: 5,
  partner_order_group: 1,
};
