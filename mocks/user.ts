import {
  GetUserAccountsResponse,
  UserAccount,
} from "services/GamMatrix/GetUserAccounts";
import { GetUserDetailsResponse } from "services/GamMatrix/GetUserDetails";

export const USER_IP = "192.168.1.134";
export const USER_ID = "USER_ID";
export const VALID_SESSION_ID = "CURRENT_SESSION_ID";
export const INVALID_SESSION_ID = "INVALID_SESSION_ID";

export const USER_DETAILS = {
  activeStatus: 0,
  address1: "ADDRESS1",
  address2: "ADDRESS2",
  affiliateMarker: "AFFILIATE_MARKER",
  alias: "USER_ALIAS",
  allowNewsEmail: true,
  allowSmsOffer: true,
  birthDate: "1969-06-09 00:00:00",
  birthName: "USER_BIRTH_NAME",
  city: "florianopolis",
  countryCode: "BR",
  currency: "BRL",
  email: "user@fakemail.com",
  errorData: {
    errorCode: 0,
    errorDetails: [],
    errorMessage: "",
    logId: 0,
  },
  firstName: "User",
  lastName: "Fake",
  middleName: "FakeJr",
  language: "PT",
  mobile: "755696969",
  mobilePrefix: "+39",
  phone: "755696969",
  phonePrefix: "+39",
  prevLoginDate: "2018-08-08 14:17:06",
  roles: [
    {
      authorDisplayName: "ddtest2102 ddtest2102",
      description: "Trusted user",
      name: "Trusted User",
      userRoleCreated: "2018-08-06 14:07:04",
      userRoleId: 3634790,
    },
    {
      authorDisplayName: "ddtest2102 ddtest2102",
      description: "User identity is verified",
      name: "Verified Identity",
      userRoleCreated: "2017-04-20 11:13:34",
      userRoleId: 3583327,
    },
  ],
  securityAnswer: "brain",
  securityQuestion: "My favourite bet?",
  signupIp: "127.0.0.1",
  success: 1,
  timestamp: "2018-08-08 14:30:37",
  title: "Mr.",
  userName: "USER_NAME",
  version: "1.0",
  zip: "969696",
  personalId: "1690609414827",
  birthCountryCode: "12",
  nationality: "Andorran",
  birthPlace: "Caldeea",
  incomeSource: null,
  licenseId: "123456789",
} satisfies GetUserDetailsResponse;

export const USER_ACCOUNT = {
  id: 1,
  displayName: "Casino",
  balanceAmount: "100",
  bonusAmount: "0",
  currency: "BRL",
  isBalanceAvailable: "1",
  omBonusAmount: "0",
} satisfies UserAccount;

export const USER_ACCOUNTS_RESPONSE = {
  accounts: [USER_ACCOUNT],
  errorData: {
    errorCode: 0,
    errorDetails: [],
    errorMessage: "",
    logId: 0,
  },
  isNegativeBalance: "0",
  success: 1,
  timestamp: "2021-08-10T15:00:00.000Z",
  version: "1.0",
} satisfies GetUserAccountsResponse;
