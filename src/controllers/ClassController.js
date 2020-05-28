import { fire } from "../config/firebaseConfig";

import * as User from "./UserController";

export async function getSelectedEvents(snapshot, events, date) {
  return new Promise((resolve, reject) => {
    snapshot.forEach(async event => {
      const value = event.val();

      const user_uid = await User.getUid();

      if (value.teacherUID === user_uid) {
        var formatedKeys = value.keys.key1.key;
        formatedKeys += value.keys.key2.key  ? (', ' + value.keys.key2.key) : '';
        formatedKeys += value.keys.key3.key ? (', ' + value.keys.key3.key) : '';

        events.push({
          title: value.name,
          date,
          description: value.description,
          begin: value.begin,
          end: value.end,
          formatedKeys,
          link: value.link,
          subject: value.subject,
          teacherUID: value.teacherUID,
          id: event.key,
          classroom: value.classroom,
          keys: {
            key1: {
              key: value.keys.key1.key
            },
            key2: {
              key: value.keys.key2.key
            },
            key3: {
              key: value.keys.key3.key
            }
          }
        })
      }
    });

    resolve(events);
  });
}

export async function loadClassroomEvents({classroom, date, subjects, classes}) {
  var formated_date = date.split('/').join('-');
  
  return new Promise((resolve, reject) => {
    try {
      var ref = fire.database().ref("events");

      classroom.map(async classroom_ => {

        const alreadySearched = classes.length > 0 ? 
          classes.find((cur) => cur.name === classroom_) : false;

        if (!alreadySearched) {
          var events = [];

          ref.child(formated_date).orderByChild("classroom").equalTo(classroom_).on("value", async (snap) => {
            classes.push({
              name: classroom_,
              events: await getSelectedEvents(snap, events, date),
            });
          });
        }
      });

      resolve(classes);
    } catch (e) {
        reject(e);
    }
  });
}
