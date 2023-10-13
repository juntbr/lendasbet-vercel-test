export interface LoginParams {
  username: string;
  password: string;
  remember: boolean;
  retry?: boolean;
}

export type callback = (params?: any) => void;

export interface SessionInfoResponse {
  userID: string;
  isAuthenticated: boolean;
  firstname: string;
  surname: string;
  email: string;
  username: string;
  currency: string;
  userCountry: string;
  ipCountry: string;
  loginTime: string;
  lastLoginTime: string;
  isEmailVerified: boolean;
  birthDate: string;
  roles: string[];
  requiredTermsAndConditions: number[];
  requiredActionsToCompleteLogin: {
    [key: string]: any;
  };
  fields: {
    [key: string]: any;
  };
  RegistrationDate: string;
  UnverifiedIdentityMaxLoginDays: number;
  UnverifiedIdentityRemainingLoginDays: number;
}
