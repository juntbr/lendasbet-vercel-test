import { FirebaseUser } from '@/hooks/useGoogleAuth/types'
import { getUserByEmail } from './queries/get-user-by-email'
export async function firebaseLogin(user): Promise<FirebaseUser> {
  const firebaseUser = await getUserByEmail(user)

  if (!firebaseUser) return

  return firebaseUser as FirebaseUser
}
