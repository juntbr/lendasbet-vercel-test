import isEmpty from "lodash/isEmpty";

export function incompleteProfileRole(roles: string[] | null) {
  return roles && Boolean(roles?.find((el) => el === "Incomplete Profile"));
}

export default function incompleteProfile(accountFields: any) {
  const condition = isEmpty(accountFields.username) ||
    isEmpty(accountFields.email) ||
    isEmpty(accountFields.gender) ||
    isEmpty(accountFields.title) ||
    isEmpty(accountFields.firstname) ||
    isEmpty(accountFields.surname) ||
    isEmpty(accountFields.birthDate) ||
    isEmpty(accountFields.mobilePrefix) ||
    isEmpty(accountFields.mobile) ||
    isEmpty(accountFields.phonePrefix) ||
    isEmpty(accountFields.phone) ||
    isEmpty(accountFields.country) ||
    !accountFields.region ||
    isEmpty(accountFields.address1) ||
    isEmpty(accountFields.address2) ||
    isEmpty(accountFields.city) ||
    isEmpty(accountFields.postalCode) ||
    isEmpty(accountFields.personalID) 
    // || isEmpty(accountFields.securityQuestion) ||
    // isEmpty(accountFields.securityAnswer);

  return condition;
}
