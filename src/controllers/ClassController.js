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
        if(event.key !== 'evento0') {
          let keyCount = 0;
          for (var i = 1; i <= 3; i++) {
            if (event.val().keys[`key${i}`].key) {
              keyCount++;
            }
          }

          const keys = event.val().keys;
          let formatedKeys = "";
          switch (keyCount) {
            case 1:
              formatedKeys = keys["key1"].key;
              break;

            case 2:
              formatedKeys = `${keys["key1"].key}, ${keys["key2"].key}`;
              break;

            case 3:
              formatedKeys = `${keys["key1"].key}, ${keys["key2"].key}, ${keys["key3"].key}`;
              break;

            default:
              formatedKeys = "Nenhuma palavra-passe";
              break;
          }

          const EVENT = {
            id: event.key,
            begin: event.val().begin,
            date: event.val().date,
            description: event.val().description,
            end: event.val().end,
            keys: keys,
            formatedKeys: formatedKeys,
            keyCount: keyCount,
            students: event.val().students,
            title: event.val().title,
            subject: event.val().subject,
            link: event.val().link
          };
          className.events.push(EVENT);
        }
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
