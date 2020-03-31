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

function updateMessage(className, { title, subject, date, begin }) {
  const message = {
    notification: {
      title: `A aula ${title} de ${subject} foi alterada`,
      body: `Remarcada para o dia ${date} às ${begin}`,
      color: "#043F5F"
    },
    to: `/topics/${className}`
  };

  return message;
}

function deleteMessage(className, { title, subject, date }) {
  const message = {
    notification: {
      title: `A aula ${title} de ${subject} foi cancelada`,
      body: `Infelizmente o(a) professor(a) de ${subject} teve que cancelar a aula`,
      color: "#043F5F"
    },
    to: `/topics/${className}`
  };

  return message;
}

export async function sendNotification(className, data, type) {
  let message = null;

  switch (type) {
    case "create":
      message = createMessage(className, data);
      break;

    case "update":
      message = updateMessage(className, data);
      break;

    case "delete":
      message = deleteMessage(className, data);
      break;

    default:
      break;
  }

  return new Promise((resolve, reject) => {
    api
      .post("https://fcm.googleapis.com/fcm/send", message)
      .then(() => resolve(true))
      .catch(error => reject(error));
  });
}
