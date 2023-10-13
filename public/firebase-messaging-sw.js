importScripts("https://www.gstatic.com/firebasejs/8.3.2/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.3.2/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyDax8sN2j4H6B6JCHjoay3Gl-3oJDo-Xns",
  authDomain: "lendasbet-6a171.firebaseapp.com",
  projectId: "lendasbet-6a171",
  storageBucket: "lendasbet-6a171.appspot.com",
  messagingSenderId: "476543014404",
  appId: "1:476543014404:web:2a0db5b489818fedf80751",
  measurementId: "G-MM6TX8SMCH"
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = "Background Message Title";
  const notificationOptions = {
    body: "Background Message body.",
    icon: "/firebase-logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
})