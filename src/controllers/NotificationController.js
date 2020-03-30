import api from "../services/api";

function createMessage(className, { title, subject, date }) {
  const message = {
    notification: {
      title: `Uma nova aula de ${subject} foi marcada`,
      body: `Marcada para o dia ${date} com o assunto: ${title}`,
      color: "#043F5F"
    },
    to: `/topics/${className}`
  };

  return message;
}

export async function sendNotification(className, data) {
  const message = createMessage(className, data);

  return new Promise((resolve, reject) => {
    api
      .post("https://fcm.googleapis.com/fcm/send", message)
      .then(() => resolve(true))
      .catch(error => reject(error));
  });
}
