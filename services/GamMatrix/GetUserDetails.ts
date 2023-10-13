import axios from "axios";
import { getGamMatrixUri } from "./endpoints";

enum ActiveStatus {
  InActive = -1,
  Active = 0,
  Blocked = 1,
  Closed = 2,
}

interface Role {
  authorDisplayName: string;
  description: string;
  name: string;
  userRoleCreated: string;
  userRoleId: number;
}

export interface GetUserDetailsResponse {
  activeStatus: ActiveStatus;
  address1: string;
  address2: string;
  affiliateMarker: string;
  alias: string;
  allowNewsEmail: boolean;
  allowSmsOffer: boolean;
  birthCountryCode: string | null;
  birthDate: string;
  birthName: string;
  birthPlace: string;
  city: string;
  countryCode: string;
  currency: string;
  email: string;
  errorData: {
    errorCode: number;
    errorDetails: string[];
    errorMessage: string;
    logId: number;
  };
  firstName: string;
  incomeSource: null;
  language: string;
  lastName: string;
  licenseId: string;
  middleName: string;
  mobile: string;
  mobilePrefix: string;
  nationality: string;
  personalId: string;
  phone: string;
  phonePrefix: string;
  prevLoginDate: string;
  roles: Role[];
  securityAnswer: string;
  securityQuestion: string;
  signupIp: string;
  success: 0 | 1;
  timestamp: string;
  title: string;
  userName: string;
  version: string;
  zip: string;
}

export async function GetUserDetails(sessionId: string) {
  try {
    const GAUri = getGamMatrixUri("GetUserDetails");

    const response = await axios.get<GetUserDetailsResponse>(
      `${GAUri}/${sessionId}`
    );

    return response.data;
  } catch (error) {
    return null;
  }
}
