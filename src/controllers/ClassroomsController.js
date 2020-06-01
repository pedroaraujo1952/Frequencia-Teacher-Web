import { fire } from "../config/firebaseConfig";

import * as User from "./UsersController";

export function getSelectedEvents(event, date, user_uid) {
  const value = event.val();

  if (value.teacherUID === user_uid) {
    var formatedKeys = value.keys.key1.key;
    formatedKeys += value.keys.key2.key  ? (', ' + value.keys.key2.key) : '';
    formatedKeys += value.keys.key3.key ? (', ' + value.keys.key3.key) : '';

    var new_event = {
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
    }

    return new_event;
  }
}

export async function loadClassroomEvents({classroom, date, classes}) {
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
            .on("value", (snap) => {
              snap.forEach((event) => {
                events.push(getSelectedEvents(event, date, user_uid))
              })
              classes.push({
                name: classroom_,
                events,
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
