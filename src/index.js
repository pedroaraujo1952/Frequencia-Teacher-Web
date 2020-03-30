import React from "react";
import ReactDOM from "react-dom";
import Route from "./routes/routes";
import * as serviceWorker from "./services/serviceWorker";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./firebase-messaging-sw.js")
    .then(function(registration) {
      //console.log("Registration successful, scope is:", registration.scope);
    })
    .catch(function(err) {
      //console.log("Service worker registration failed, error:", err);
    });
}

ReactDOM.render(
  <React.StrictMode>
    <Route />
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.unregister();
