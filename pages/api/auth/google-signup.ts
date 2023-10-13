/* eslint-disable camelcase */
import { GoogleUser } from "@/hooks/useGoogleAuth/types";
import jwt_decode from "jwt-decode";
import { NextApiRequest, NextApiResponse } from "next";
import { firebaseSignUp } from "../../../server/usecases/firebase/firebase-signup";
import { CashipApi } from "services/Caship";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { credential, document } = req.body;
  const { data } = await CashipApi("validateCPF", { cpf: document });
  const user = jwt_decode(credential) as GoogleUser;
  const userAuth = await firebaseSignUp(user, document);
  res.status(200).json({ user: userAuth, birthdate: data.birthdate });
}
