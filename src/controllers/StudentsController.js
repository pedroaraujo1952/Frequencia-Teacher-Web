import { database } from "../config/firebaseConfig";

export function validateKey(array) {
  var keys = array;
  var count = 0;

  keys.forEach(element => {
    if (element.val() === "ok") count++;
  });

  return count;
}

export function validateTime(eventInit, studentTime) {
  if (eventInit === studentTime) return true;
  else return false;
}

export async function getStudents(className) {
  return new Promise((resolve, reject) => {
    database.ref(`salas/${className}`).once("value", snap => {
      resolve(snap.val());
    });
  });
}
