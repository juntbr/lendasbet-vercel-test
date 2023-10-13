export interface GoogleUser {
  iss: string;
  nbf: number;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  azp: string;
  name: string;
  picture: string;
  given_name: string;
  iat: number;
  exp: number;
  jti: string;
}

export interface FirebaseUser {
    name: string;
    email: string;
    id: string;
    document: string;
    password: string;
}


export interface RegisterRequest {
  gender: string;
  phone: string;
  postalCode: string;
  address1: string;
  address2: string;
  city: string;
  region: number;
  firstName: string;
  surname: string;
  username: string;
  birthdate: string;
  title: string;
  email: string;
  personalId: string;
  password: string;
  retryPassword: string;
  currency: string;
  emailVerificationURL: string;
  phonePrefix: string;
  mobilePrefix: string;
  mobile: string;
  language: string;
  country: string;
  affiliateMarker?: string;
  userConsents: {
    termsandconditions: boolean;
    emailmarketing: boolean;
    sms: boolean;
    smsandemail: boolean;
    "3rdparty": boolean;
  };
}

