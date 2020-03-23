import React from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import Error404 from "../errors/Error404/404";
import Main from "../App";

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Main} />
      <Route path="*" component={Error404} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
