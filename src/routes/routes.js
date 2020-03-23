import React from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import Main from "../App";
import Profile from "../pages/Profile/Profile";

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Main} />
      <Route exact path="/profile"><Profile/></Route>
    </Switch>
  </BrowserRouter>
);

export default Routes;