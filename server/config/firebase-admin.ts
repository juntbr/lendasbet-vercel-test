import * as firebaseAdmin from "firebase-admin";

// get this JSON from the Firebase board
// you can also store the values in environment variables

const privateKey = process.env.GOOGLE_AUTH_PRIVATE_KEY;
const clientEmail = process.env.GOOGLE_AUTH_CLIENT_EMAIL;


if (!firebaseAdmin.apps.length) {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
      privateKey: privateKey,
      clientEmail: clientEmail,
      projectId: process.env.FIREBASE_PROJECT_ID,
    }),
  });
}

export { firebaseAdmin };

