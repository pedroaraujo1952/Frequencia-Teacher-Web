import React from "react";
import ReactDOM from "react-dom";
import Route from "./routes/routes";
import * as serviceWorker from "./services/serviceWorker";

ReactDOM.render(
  <React.StrictMode>
    <Route />
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.unregister();
