import { fire, database } from "../config/firebaseConfig";

export async function getStudents(className) {
  return new Promise((resolve, reject) => {
    database.ref(`salas/${className}`).once("value", snap => {
      resolve(snap.val());
    });
  });
}
