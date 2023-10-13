
export enum policies {
  AmlKycPolicy = "aml-kyc-policy",
  PrivacyPolicy = "privacy-policy",
  ResponsibleGambling = "responsible-gambling",
  TermsAndConditions = "terms-and-conditions"
};

export enum policiesFileNames {
  AmlKycPolicy = "AMLKYCPolicylendasbet",
  PrivacyPolicy = "PrivacyPolicylendasbet",
  ResponsibleGambling = "ResponsibleGamblinglendasbet",
  TermsAndConditions = "StandardTermsandConditionslendasbet"
}



export function getPolicyFileName(policy, language = 'en'){
  if(language === 'en'){
    language = '-en';
  } else {
    language = `-${language}`;
  }
  switch (policy) {
    case policies.AmlKycPolicy:
      return policiesFileNames.AmlKycPolicy + language;
    case policies.PrivacyPolicy:
      return policiesFileNames.PrivacyPolicy + language;
    case policies.ResponsibleGambling:
      return policiesFileNames.ResponsibleGambling + language;
    case policies.TermsAndConditions:
      return policiesFileNames.TermsAndConditions + language;
    default:
      return policiesFileNames.TermsAndConditions + language;
  }

}