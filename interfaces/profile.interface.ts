export interface ProfileRequest {}

export interface ProfileField {
  alias?: string;
  userID?: string;
  username?: string;
  nationality?: string;
  birthplace?: string;
  intendedVolume?: number;
  idPhotoUrl?: string;
  countrySubDivision?: string;
  birthCountry?: string;
  birthName?: string;
  email?: string;
  gender?: string;
  title?: string;
  firstname?: string;
  surname?: string;
  birthDate?: string;
  birthYear?: number;
  birthMonth?: number;
  birthDay?: number;
  mobilePrefix?: string;
  mobile?: string;
  phonePrefix?: string;
  phone?: string;
  country?: string;
  region?: number;
  address1?: string;
  address2?: string;
  city?: string;
  postalCode?: string;
  personalID?: string;
  securityQuestion?: string;
  securityAnswer?: string;
  language?: string;
  currency?: string;
  affiliateMarker?: string;
  acceptNewsEmail?: boolean;
  acceptSMSOffer?: boolean;
  paymentMethod?: string;
  LastLogin?: string;
  isEmailVerified?: boolean;
}

export interface ProfileResponse {
  fields: ProfileField;
  incomeSource: string;
  isFirstnameUpdatable: boolean;
  isSurnameUpdatable: boolean;
  isBirthDateUpdatable: boolean;
  isCountryUpdatable: boolean;
  isCurrencyUpdatable: boolean;
  isEmailUpdatable: boolean;
  IsProfileUpdatable: boolean;
}
