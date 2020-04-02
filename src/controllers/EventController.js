import { fire, database } from "../config/firebaseConfig";

import * as Student from "./StudentsController";
import * as User from "./UserController";
import * as Notif from "./NotificationController";

export async function createEvent(state) {
  return new Promise(async (resolve, reject) => {
    try {
      var uid = fire.auth().currentUser.uid;

      var data = {
        title: state.name,
        subject: await User.getSubject(uid),
        link: state.link.includes("https://")
          ? state.link
          : "https://" + state.link,
        begin: state.hourBegin + "h" + state.minutesBegin,
        date: state.date,
        description: state.description,
        end: state.hourEnd + "h" + state.minutesEnd,
        keys: {
          key1: {
            key: state.keyWord[0],
            time: state.notifTime[0]
          },
          key2: {
            key: state.keyWord[1],
            time: state.notifTime[1]
          },
          key3: {
            key: state.keyWord[2],
            time: state.notifTime[2]
          }
        },
        students: await Student.getStudents(state.nameClass)
      };

      await database
        .ref(`professores/${uid}/events/${state.nameClass}`)
        .push(data)
        .then(() => {
          Notif.sendNotification(state.nameClass, data, "create").then(
            () => resolve(true),
            error => reject(error)
          );
        });
    } catch (error) {
      reject(error);
    }
  });
}

export async function deleteEvent(event, className) {
  return new Promise((resolve, reject) => {
    var uid = fire.auth().currentUser.uid;

    if (event.id !== "evento0") {
      database
        .ref(`professores/${uid}/events/${className}/${event.id}`)
        .remove()
        .then(() => {
          Notif.sendNotification(className, event, "delete").then(
            () => resolve(true),
            error => reject(error)
          );
        });

      resolve(true);
    }
  });
}

export async function updateEvent(state) {
  var keysAfter = 0;
  if(state.keyWord[0] !== "")keysAfter++;
  if(state.keyWord[1] !== "")keysAfter++;
  if(state.keyWord[2] !== "")keysAfter++;
  if(keysAfter !== 0){
    state.key = {
      key1: {
        key: state.keyWord[0],
        time: state.notifTime[0]
      },
      key2: {
        key: state.keyWord[1],
        time: state.notifTime[1]
      },
      key3: {
        key: state.keyWord[2],
        time: state.notifTime[2]
      }
    }
  }
  return new Promise(async (resolve, reject) => {
    try {
      var uid = fire.auth().currentUser.uid;
      var data = {
        title: state.name,
        subject: await User.getSubject(uid),
        link: state.link.includes("https://")
          ? state.link
          : "https://" + state.link,
        begin: state.hourBegin + "h" + state.minutesBegin,
        date: state.date,
        description: state.description,
        end: state.hourEnd + "h" + state.minutesEnd,
        keys: state.key,
        students: state.students
      };

      database
        .ref(`professores/${uid}/events/${state.nameClass}/${state.id}`)
        .set(data)
        .then(() => {
          Notif.sendNotification(state.nameClass, data, "update").then(
            () => resolve(true),
            error => reject(error)
          );
        });
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
}
