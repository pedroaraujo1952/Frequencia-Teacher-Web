// import * as User from "../controllers/UserController";
// import { database } from "../config/firebaseConfig";

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
