import * as firebase from "firebase/app";

import { fire, database } from "../config/firebaseConfig";

import Error from "../errors/user.error";
import Teacher from "../models/Teacher";

export async function createUser({ name, subject, email, pswd, pswdConfirm }) {
  return new Promise((resolve, reject) => {
    var numbers = 0;

    for(var i=0; i<email.length;i++){
      if(!isNaN(parseInt(email[i],))){
        numbers += 1;
      }
    }
    
    if (!email.includes("@fmm.org") || numbers === 6) {
      const error = {
        code: "auth/unauthorized-domain",
      };
      const ERROR = new Error(error);
      reject(ERROR.getError);
    } else if (pswd === pswdConfirm) {
      const user = Teacher(name, subject, email);

      fire
        .auth()
        .createUserWithEmailAndPassword(email, pswd)
        .then(() => {
          const uid = fire.auth().currentUser.uid;

          database
            .ref(`teachers/${uid}`)
            .set(user)
            .then(() => {
              updateUserName(name).then(
                () => resolve(true),
                (error) => {
                  fire.auth().currentUser.delete();
                  const ERROR = new Error(error);
                  reject(ERROR.getError);
                }
              );
            })
            .catch((error) => {
              fire.auth().currentUser.delete();
              const ERROR = new Error(error);
              reject(ERROR.getError);
            });
        })
        .catch((error) => {
          const ERROR = new Error(error);
          reject(ERROR.getError);
        });
    } else {
      const error = {
        code: "auth/wrong-confirm-password",
      };
      const ERROR = new Error(error);
      reject(ERROR.getError);
    }
  });
}

export async function getSubject() {
  const uid = fire.auth().currentUser.uid;

  return new Promise((resolve, reject) => {
    try {
      database.ref(`teachers/${uid}/subject`).once("value", (snap) => {
        resolve(snap.val());
      });
    } catch (e) {
      reject(e);
    }
  });
}

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
        avatar: response.photoURL,
      };

      resolve(user);
    } else {
      reject({});
    }
  });
}

export async function getUid() {
  return new Promise((resolve, reject) => {
    resolve(fire.auth().currentUser.uid);
  });
}

export async function login(email, password) {
  var hasLoaded = true;

  return new Promise((resolve, reject) => {
    fire
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => resolve(hasLoaded))
      .catch((error) => {
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
        photoURL: photoURL,
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
        displayName: displayName,
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
        photoURL: photoURL,
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
      .catch((error) => {
        //Error code validation
        const ERROR = new Error(error);
        reject(ERROR.getError);
      });
  });
}

export async function changeEmail(newEmail) {
  const user = fire.auth().currentUser;

  return new Promise((resolve, reject) => {
    user
      .updateEmail(newEmail)
      .then(() => resolve(true))
      .catch((error) => {
        //Error code validation
        const ERROR = new Error(error);
        reject(ERROR.getError);
      });
  });
}

export async function changePassword(newPsdw) {
  const user = fire.auth().currentUser;

  return new Promise((resolve, reject) => {
    user
      .updatePassword(newPsdw)
      .then(() => resolve(true))
      .catch((error) => {
        //Error code validation
        const ERROR = new Error(error);
        reject(ERROR.getError);
      });
  });
}
