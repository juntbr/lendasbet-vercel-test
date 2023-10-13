import { FirebaseUser, GoogleUser } from '@/hooks/useGoogleAuth/types'
import bcrypt from 'bcrypt'
import { firebaseAdmin } from 'server/config/firebase-admin'
import { getUserByEmail } from './queries/get-user-by-email'

async function firebaseSignUp(user: GoogleUser, document: string) {
  const firebaseUser = await getUserByEmail(user)

  if (!firebaseUser) return createNewFirebaseUser(user, document)

  return firebaseUser
}

async function createNewFirebaseUser(
  user: GoogleUser,
  document: string,
): Promise<FirebaseUser> {
  const randomPassword = await hashPassword()
  await firebaseAdmin.firestore().collection('users').add({
    name: user.name,
    email: user.email,
    id: user.sub,
    document,
    password: randomPassword,
  })
  return {
    name: user.name,
    email: user.email,
    id: user.sub,
    document,
    password: randomPassword,
  }
}

async function hashPassword(): Promise<string> {
  const password = Math.random().toString(36).slice(-10)

  const saltRounds = 10
  const hashedPassword = await bcrypt.hash(password, saltRounds)

  return hashedPassword
}

export { firebaseSignUp }
