/* eslint-disable no-unused-vars */
import { getApp, getApps, initializeApp } from "firebase/app";
// import { doc, getFirestore, setDoc } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import localforage from "localforage";

type FirebaseConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
};

const firebaseConfig: FirebaseConfig = {
  apiKey: "AIzaSyDax8sN2j4H6B6JCHjoay3Gl-3oJDo-Xns",
  authDomain: "lendasbet-6a171.firebaseapp.com",
  projectId: "lendasbet-6a171",
  storageBucket: "lendasbet-6a171.appspot.com",
  messagingSenderId: "476543014404",
  appId: "1:476543014404:web:2a0db5b489818fedf80751",
  measurementId: "G-MM6TX8SMCH",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

class FirebaseCloudMessaging {
  static async tokenInLocalForage(): Promise<string | null> {
    const token = await localforage.getItem("fcm_token") as string;
    return token;
  }

  static async onMessage(): Promise<void> {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      console.log("Message received. ", payload);
      alert("Notification");
    });
  }

  static async init(): Promise<void> {
    try {
      console.log("Initializing Firebase Messaging.");
      const messaging = getMessaging(app);
      await Notification.requestPermission();
      const currentToken = await getToken(messaging, {
        vapidKey: "BMnIow0-YGcFqkfRHx7NqV49gQp-y1GKIhXhZj-lr4eMiLblYboDLpAnz0vuZTB9CutCpZkbt4bp4JsdiuCDrqI",
      });
      // console.log("current Token", currentToken);
      if (currentToken) {
        localforage.setItem("fcm_token", currentToken);
        // console.log("fcm_token", currentToken);
      } else {
        console.log(
          "No registration token available. Request permission to generate one."
        );
      }
    } catch (error) {
      console.error(error);
    }
  }
}


export default FirebaseCloudMessaging;