import { fire, database } from "../config/firebaseConfig";

import * as Student from "./StudentController";
import * as User from "./User";

export async function createEvent(state) {
  return new Promise(async (resolve, reject) => {
    try {
      var uid = fire.auth().currentUser.uid;

      var data = {
        title: state.name,
        subject: await User.getSubject(uid),
        link: state.link,
        begin: state.hourBegin + "h" + state.minutesBegin,
        date: state.date,
        description: state.description,
        end: state.hourEnd + "h" + state.minutesEnd,
        keys: {
          key1: state.keyWord[0],
          key2: state.keyWord[1],
          key3: state.keyWord[2]
        },
        students: await Student.getStudents(state.nameClass)
      };

      database.ref(`professores/${uid}/events/${state.nameClass}`).push(data);
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
}

export async function updateEvent(state) {
  return new Promise(async (resolve, reject) => {
    try {
      var uid = fire.auth().currentUser.uid;

      var data = {
        title: state.name,
        subject: await User.getSubject(uid),
        link: state.link,
        begin: state.hourBegin + "h" + state.minutesBegin,
        date: state.date,
        description: state.description,
        end: state.hourEnd + "h" + state.minutesEnd,
        keys: {
          key1: state.keyWord[0],
          key2: state.keyWord[1],
          key3: state.keyWord[2]
        },
        students: await Student.getStudents(state.nameClass)
      };

      database.ref(`professores/${uid}/events/${state.nameClass}/`).push(data);
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
}
