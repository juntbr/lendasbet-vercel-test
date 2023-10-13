import { GoogleUser } from '@/hooks/useGoogleAuth/types'
import { firebaseAdmin } from '../../../config/firebase-admin'

async function getUserByEmail(user: GoogleUser) {
  const currentUser = await firebaseAdmin
    .firestore()
    .collection('users')
    .where('email', '==', user.email)
    .get()

  const userData = currentUser.docs.map((doc) => doc.data())
  if (userData.length === 0) return

  return userData[0]
}

export { getUserByEmail }
