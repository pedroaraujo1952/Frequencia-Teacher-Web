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
        if (event.key !== "evento0") className.events.push(event.val());
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
      database.ref("professores/" + uid + "/events").on("value", snap => {
        getClasses(snap).then(res => {
          resolve(res);
        });
      });
    } catch (e) {
      reject(e);
    }
  });
}
