import { fire } from "../config/firebaseConfig";

import * as User from "./UsersController";

export async function getSelectedEvents(snapshot, events, date, user_uid) {
  return new Promise((resolve, reject) => {
    snapshot.forEach(async event => {
      const value = event.val();

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
          
          const user_uid = await User.getUid();

          ref.child(formated_date)
            .child(classroom_)
            .orderByChild("teacherUID")
            .equalTo(user_uid)
            .on("value", async (snap) => {
            classes.push({
              name: classroom_,
              events: await getSelectedEvents(snap, events, date, user_uid),
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
