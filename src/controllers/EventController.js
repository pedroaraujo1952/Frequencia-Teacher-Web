import { fire, database } from "../config/firebaseConfig";

import * as Student from "./StudentController";
import * as User from "./UserController";

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

export async function deleteEvent(event, className) {
  return new Promise((resolve, reject) => {
    var uid = fire.auth().currentUser.uid;

    console.log(uid);

    if (event.id !== "evento0") {
      database
        .ref(`professores/${uid}/events/${className}/${event.id}`)
        .remove();

      resolve(true);
    }
  });
}
