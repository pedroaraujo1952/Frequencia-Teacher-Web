import * as firebase from "firebase/app";

import { fire, database } from "../config/firebaseConfig";

import Error from "../errors/user.error";

export async function createUser({ name, subject, email, pswd, pswdConfirm }) {
  return new Promise((resolve, reject) => {
    // if (!email.includes("@fmm.org")) {
    //   const error = {
    //     code: "auth/unauthorized-domain"
    //   };
    //   const ERROR = new Error(error);
    //   reject(ERROR.getError);
    /*} else*/ if (pswd === pswdConfirm) {
      const user = {
        name: name,
        subject: subject,
        email: email,
        events: {
          "3AI": {
            evento0: {
              begin: " ",
              date: " ",
              description: " ",
              end: " ",
              keys: {
                key1: {
                  key: "",
                  time: ""
                },
                key2: {
                  key: "",
                  time: ""
                },
                key3: {
                  key: "",
                  time: ""
                }
              },
              link: "",
              students: {
                student0: {
                  checkin: "",
                  checkout: "",
                  keys: {
                    key1: {
                      key: "",
                      time: ""
                    },
                    key2: {
                      key: "",
                      time: ""
                    },
                    key3: {
                      key: "",
                      time: ""
                    }
                  },
                  name: ""
                }
              },
              subject: "",
              title: " "
            }
          },
          "3BI": {
            evento0: {
              begin: " ",
              date: " ",
              description: " ",
              end: " ",
              keys: {
                key1: {
                  key: "",
                  time: ""
                },
                key2: {
                  key: "",
                  time: ""
                },
                key3: {
                  key: "",
                  time: ""
                }
              },
              link: "",
              students: {
                student0: {
                  checkin: "",
                  checkout: "",
                  keys: {
                    key1: {
                      key: "",
                      time: ""
                    },
                    key2: {
                      key: "",
                      time: ""
                    },
                    key3: {
                      key: "",
                      time: ""
                    }
                  },
                  name: ""
                }
              },
              subject: "",
              title: " "
            }
          },
          "3CI": {
            evento0: {
              begin: " ",
              date: " ",
              description: " ",
              end: " ",
              keys: {
                key1: {
                  key: "",
                  time: ""
                },
                key2: {
                  key: "",
                  time: ""
                },
                key3: {
                  key: "",
                  time: ""
                }
              },
              link: "",
              students: {
                student0: {
                  checkin: "",
                  checkout: "",
                  keys: {
                    key1: {
                      key: "",
                      time: ""
                    },
                    key2: {
                      key: "",
                      time: ""
                    },
                    key3: {
                      key: "",
                      time: ""
                    }
                  },
                  name: ""
                }
              },
              subject: "",
              title: " "
            }
          }
        }
      };

      fire
        .auth()
        .createUserWithEmailAndPassword(email, pswd)
        .then(() => {
          const uid = fire.auth().currentUser.uid;

          database
            .ref(`professores/${uid}`)
            .set(user)
            .then(() => {
              updateUserName(name).then(
                () => resolve(true),
                error => {
                  fire.auth().currentUser.delete();
                  const ERROR = new Error(error);
                  reject(ERROR.getError);
                }
              );
            })
            .catch(error => {
              fire.auth().currentUser.delete();
              const ERROR = new Error(error);
              reject(ERROR.getError);
            });
        })
        .catch(error => {
          const ERROR = new Error(error);
          reject(ERROR.getError);
        });
    } else {
      const error = {
        code: "auth/wrong-confirm-password"
      };
      const ERROR = new Error(error);
      reject(ERROR.getError);
    }
  });
}

export async function getSubject(uid) {
  return new Promise((resolve, reject) => {
    database.ref(`professores/${uid}/subject`).once("value", snap => {
      console.log(snap.val());
      resolve(snap.val());
    });
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

export async function changeEmail(newEmail) {
  const user = fire.auth().currentUser;

  return new Promise((resolve, reject) => {
    user
      .updateEmail(newEmail)
      .then(() => resolve(true))
      .catch(error => {
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
      .catch(error => {
        //Error code validation
        const ERROR = new Error(error);
        reject(ERROR.getError);
      });
  });
}
