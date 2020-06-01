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

export async function getSelectedStudents(snapshot, students) {
  return new Promise((resolve, reject) => {
    snapshot.forEach(student => {
        students[student.key] = {
          name: student.val().name,
          checkin: '',
          checkout: '',
          keys: {
            key1: '',
            key2: '',
            key3: '',
          }
        };
      }
    );
    resolve(students);
  });
}

export async function getStudents(className) {
  return new Promise((resolve, reject) => {
    try {
      var students = {};

      database.ref(`students`)
        .child(className)  
        .on("value", async snap => {
        students = await getSelectedStudents(snap, students);
      });

      resolve(students);
    } catch (e) {
      reject(e);
    }
  });
}
