import { fire, database } from "../config/firebaseConfig";

import { formatDate, compareDates } from "../utils/FormatDate";

import * as Student from "./StudentsController";
import * as Notif from "./NotificationsController";

export async function createEvent(state) {
  return new Promise(async (resolve, reject) => {
    try {
      var uid = fire.auth().currentUser.uid;

      state.classroom.forEach(async (classroom) => {
        var data = {
          name: state.name,
          subject: state.selectedSubject,
          classroom,
          link: state.link.includes("https://")
            ? state.link
            : state.link.includes("http://")
            ? state.link.replace("http://", "https://")
            : "https://" + state.link,
          begin: state.hourBegin + "h" + state.minutesBegin,
          description: state.description,
          end: state.hourEnd + "h" + state.minutesEnd,
          keys: {
            key1: {
              key: state.keyWord[0],
              time: state.notifTime[0],
            },
            key2: {
              key: state.keyWord[1],
              time: state.notifTime[1],
            },
            key3: {
              key: state.keyWord[2],
              time: state.notifTime[2],
            },
          },
          teacherUID: uid,
        };

        var students = await Student.getStudents(classroom); 

        await database
          .ref(`events/${state.date.split('/').join('-')}/${classroom}`)
          .push(data)
          .then(async (snap) => {
            await database
            .ref(`frequency/${classroom}/${snap.key}`)
            .set(students);

            Notif.sendNotification(classroom, data, "create").then(
              () => resolve(true),
              (error) => reject(error)
            );
          });
      });
    } catch (error) {
      reject(error);
    }
  });
}

export async function deleteEvent(event, className) {
  return new Promise((resolve, reject) => {
    database
      .ref(`events/${event.date.split('/').join('-')}/${className}/${event.id}`)
      .remove()
      .then(async () => {
        const { date } = event;
        const fullDate = formatDate();

        await database
          .ref(`frequency/${className}/${event.id}`)
          .remove()

        if (!compareDates(fullDate, date)) {
          Notif.sendNotification(className, event, "delete").then(
            () => resolve(true),
            (error) => reject(error)
          );
        }
      });

      resolve(true);
  });
}

export async function updateEvent(state, className) {
  return new Promise(async (resolve, reject) => {
    console.log(state)
    try {
      var data = {
        title: state.name,
        subject: state.selectedSubject,
        link: state.link.includes("https://")
          ? state.link
          : state.link.includes("http://")
          ? state.link.replace("http://", "https://")
          : "https://" + state.link,
        begin: state.hourBegin + "h" + state.minutesBegin,
        date: state.date,
        description: state.description,
        end: state.hourEnd + "h" + state.minutesEnd,
        keys: {
          key1: {
            key: state.keyWord[0],
            time: state.notifTime[0],
          },
          key2: {
            key: state.keyWord[1],
            time: state.notifTime[1],
          },
          key3: {
            key: state.keyWord[2],
            time: state.notifTime[2],
          },
        },
      };

      database
        .ref(`events/${state.date.split('/').join('-')}/${className}/${state.id}`)
        .update(data)
        .then(() => {
          Notif.sendNotification(className, data, "update").then(
            () => resolve(true),
            (error) => reject(error)
          );
        });
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
}
