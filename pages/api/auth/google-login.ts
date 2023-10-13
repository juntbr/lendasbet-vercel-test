/* eslint-disable camelcase */
import jwt_decode from 'jwt-decode'
import { NextApiRequest, NextApiResponse } from 'next'
import { firebaseLogin } from '../../../server/usecases/firebase/firebase-login'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { credential } = req.body;
  const user = jwt_decode(credential);
  const userAuth = await firebaseLogin(user);
  if (!userAuth) return res.status(401).json({ message: "user not found" });
  res.status(200).json({ user: userAuth });
}
