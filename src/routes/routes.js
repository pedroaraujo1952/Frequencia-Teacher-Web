import React from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import Error404 from "../errors/Error404/404";
import Main from "../App";
import Profile from "../pages/Profile/Profile";

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Main} />
      <Route exact path="/profile" component={Profile} />
      <Route path="*" component={Error404} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
