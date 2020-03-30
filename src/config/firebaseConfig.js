import * as firebase from "firebase";
import "firebase/messaging";

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

export const fire = firebase.initializeApp(config, {
  messagingSenderId: "100699814698"
});
export const database = firebase.database();
export const storage = firebase.storage();
// const messaging = firebase.messaging();

// messaging.usePublicVapidKey(
//   // Project Settings => Cloud Messaging => Web Push certificates
//   "BLzTUv-eL8F44SUM-YYcFMqjxVDQevbT6cAc9kgJfa7DvfQWG0USpx4N2hOz3mm9nqNn4Y4w_M8RndSRQBYbXNg"
// );

// export { messaging };

// console.log(messaging);
