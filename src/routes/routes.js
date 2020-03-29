import React from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import Error404 from "../errors/Error404/404";
import Main from "../App";
import Profile from "../pages/Profile/Profile";
import Report from "../pages/Report/Report";
import Register from "../pages/Register/Register";
import Home from "../pages/Home/Home";

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Main} />
      <Route exact path="/signup" component={Register} />
      <Route exact path="/home" component={Home} />
      <Route exact path="/profile" component={Profile} />
      <Route exact path="/report" component={Report} />
      <Route path="*" component={Error404} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
