import firebase from "firebase";

const config = {
  apiKey: "AIzaSyBlQQI3JBcknV3aO26rg2LAlPNehiqocEs",
  authDomain: "fmm-check-student.firebaseapp.com",
  databaseURL: "https://fmm-check-student.firebaseio.com",
  projectId: "fmm-check-student",
  storageBucket: "fmm-check-student.appspot.com",
  messagingSenderId: "100699814698",
  appId: "1:100699814698:web:5cf7d564f5c4f1ab18fc53",
  measurementId: "G-CSTFMB3P7H"
};

export const fire = firebase.initializeApp(config);
export const firebaseDatabase = firebase.database();
export const storage = firebase.storage();
