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
  //Split time
  eventInit = eventInit.split("h");
  studentTime = studentTime.split("h");

  //Validate curfew extra time
  if (parseInt(eventInit[1]) + 10 >= 60) {
    eventInit[1] = parseInt(eventInit[1]) + 10;
    eventInit[1] = eventInit[1] - 60;
    eventInit[0]++;
  } else eventInit[1] = parseInt(eventInit[1]) + 10;

  //Passing checkin time to int
  studentTime[0] = parseInt(studentTime[0]);
  studentTime[1] = parseInt(studentTime[1]);

  //Validate checkin hours
  if (studentTime[0] <= eventInit[0]) {
    //Validate checkin minutes
    if (studentTime[1] <= eventInit[1]) return true;
    else if (studentTime[0] < eventInit[0]) return true;
  }

  return false;
}

export async function getStudents(className) {
  return new Promise((resolve, reject) => {
    database.ref(`salas/${className}`).once("value", snap => {
      resolve(snap.val());
    });
  });
}
