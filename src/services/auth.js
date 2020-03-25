import { fire } from "../config/firebaseConfig";

export function isLogged() {
  var user = fire.auth().currentUser;

  if (!user) window.location.replace("/");
}
