import { fire, database } from "../config/firebaseConfig";

export async function getClasses(snapshot) {
  return new Promise((resolve, reject) => {
    var classroom = [];
    snapshot.forEach(nameClass => {
      var className = {
        name: nameClass.key,
        events: []
      };

      nameClass.forEach(event => {
        const EVENT = {
          id: event.key,
          begin: event.val().begin,
          date: event.val().date,
          description: event.val().description,
          end: event.val().end,
          keys: event.val().keys,
          students: event.val().students,
          title: event.val().title
        };
        if (event.key !== "evento0") className.events.push(EVENT);
      });
      classroom.push(className);
    });
    resolve(classroom);
  });
}

export async function loadClasses() {
  const uid = fire.auth().currentUser.uid;

  return new Promise((resolve, reject) => {
    try {
      const classRef = database.ref("professores/" + uid + "/events");

      classRef.on("value", snap => {
        getClasses(snap).then(res => {
          resolve(res);
        });
      });
    } catch (e) {
      reject(e);
    }
  });
}
