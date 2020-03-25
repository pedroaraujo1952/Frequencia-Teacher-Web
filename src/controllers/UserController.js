import * as firebase from "firebase/app";

import { fire } from "../config/firebaseConfig";
import Error from "../errors/user.error";

export async function getUser() {
  return new Promise((resolve, reject) => {
    const response = fire.auth().currentUser;

    if (response) {
      const user = {
        uid: response.uid,
        username: response.displayName
          ? response.displayName
          : "Sem nome de usuário",
        email: response.email,
        avatar: response.photoURL
      };

      resolve(user);
    } else {
      reject({});
    }
  });
}

export async function login(email, password) {
  var hasLoaded = true;

  return new Promise((resolve, reject) => {
    fire
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => resolve(hasLoaded))
      .catch(error => {
        //Error code validation
        const ERROR = new Error(error);
        reject(ERROR.getError);
      });
  });
}

export function reauthUser(email, password) {
  var user = firebase.auth().currentUser;

  //Create the reauthentication credential
  var credential = firebase.auth.EmailAuthProvider.credential(email, password);

  //Reauthenticate user to update data
  return user.reauthenticateWithCredential(credential);
}

export async function updateUserPhoto(photoURL) {
  return new Promise((resolve, reject) => {
    var user = firebase.auth().currentUser;
    user
      .updateProfile({
        photoURL: photoURL
      })
      .then(() => {
        resolve(true);
      })
      .catch(() => {
        reject("Não foi possível atualizar as informações");
      });
  });
}

export async function updateUserName(displayName) {
  return new Promise((resolve, reject) => {
    var user = firebase.auth().currentUser;
    user
      .updateProfile({
        displayName: displayName
      })
      .then(() => {
        resolve(true);
      })
      .catch(() => {
        reject("Não foi possível atualizar as informações");
      });
  });
}

export async function updateUserProfile(displayName, photoURL) {
  return new Promise((resolve, reject) => {
    var user = firebase.auth().currentUser;
    user
      .updateProfile({
        displayName: displayName,
        photoURL: photoURL
      })
      .then(() => {
        resolve(true);
      })
      .catch(() => {
        reject("Não foi possível atualizar as informações");
      });
  });
}

export async function forgotPassword(email) {
  const message = `Email enviado para ${email}\nVerifique sua caixa de mensagens`;

  return new Promise((resolve, reject) => {
    fire
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => resolve(message))
      .catch(error => {
        //Error code validation
        const ERROR = new Error(error);
        reject(ERROR.getError);
      });
  });
}
