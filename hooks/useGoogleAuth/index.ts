import axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import isNotEmpty from "utils/checkForEmpty";
import { doToast } from "utils/toastOptions";
import { AFFILIATE_CODE } from "../../constants";
import { useSession } from "../useSession";
import { FirebaseUser, GoogleUser, RegisterRequest } from "./types";

export default function useGoogleAuth() {
  const { session } = useSession();

  async function handleGoogleRegistration(
    credential: string,
    document: string,
    callLogin: (loginData: { username: string; password: string }) => void
  ) {
    const { email } = jwt_decode(credential) as GoogleUser;

    const verifyEmail = await session.call("/user/account#validateEmail", {
      email: email,
    });

    if (!verifyEmail.isAvailable) {
      doToast("Este e-mail já está cadastrado com uma conta do Lendas.");
      return;
    }

    const response = await axios.post("/api/auth/google-signup", {
      credential,
      document,
    });

    const { user, birthdate } = response.data as { user: FirebaseUser, birthdate: string };

    let request = buildRegisterRequest(user, birthdate);

    try {
      await session.call("/user/account#register", request);
      callLogin({
        username: user.email,
        password: user.password,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function handleGoogleAuthentication(
    credential: string,
    callApi: (loginData: { username: string; password: string }) => void
  ) {
    try {
      const response = await axios.post("/api/auth/google-login", {
        credential,
      });
      const { user } = response.data;

      await callApi({
        username: user.email,
        password: user.password,
      });
    } catch (error) {
      doToast(
        "Este e-mail não está cadastrado com uma conta Google, prossiga para o cadastro."
      );
    }
  }

  return {
    handleGoogleRegistration,
    handleGoogleAuthentication,
  };
}

function buildRegisterRequest(
  user: FirebaseUser,
  birthdate: string
): RegisterRequest {
  const paramsForCompleteProfile = {
    gender: "M",
    phone: "0000000000",
    postalCode: "00000000",
    address1: "officeLendas",
    address2: "officeLendas",
    city: "officeLendas",
    region: 1083,
    country: "officeLendas",
  };

  const firstName = user.name.split(" ")[0];
  const surname = user.name.substring(firstName.length).trim();

  const request: RegisterRequest = {
    ...paramsForCompleteProfile,
    firstName: firstName,
    surname: surname,
    birthdate,
    username: user.email,
    title: "Mr.",
    email: user.email,
    personalId: user.document,
    password: user.password,
    retryPassword: user.password,
    currency: "BRL",
    emailVerificationURL: `${process.env.NEXT_PUBLIC_BASE_URL}/account/active/`,
    phonePrefix: "+55",
    mobilePrefix: "+55",
    mobile: "0000000000",
    country: "BR",
    language: "pt-br",
    userConsents: {
      termsandconditions: true,
      emailmarketing: false,
      sms: false,
      smsandemail: false,
      "3rdparty": true,
    },
  };

  if (isNotEmpty(Cookies.get(AFFILIATE_CODE))) {
    request["affiliateMarker"] = Cookies.get(AFFILIATE_CODE);
  }
  return request;
}
