import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMessaging, isSupported } from "firebase/messaging";
// import analytics, { getAnalytics } from "firebase/analytics";

const credentials = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const firebase = getApps().length === 0 ? initializeApp(credentials) : getApps()[0];
// if(analytics.isSupported()){
//     const analytics = getAnalytics(firebase);
// }

export const firestore = getFirestore();

export const messaging = (async () => {
  try {
      const isSupportedBrowser = await isSupported();
      if (isSupportedBrowser) {
          return getMessaging(firebase);
      }
      console.log('Firebase not supported this browser');
      return null;
  } catch (err) {
      console.log(err);
      return null;
  }
  })();


export default firebase;