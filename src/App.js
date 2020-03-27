import React, { Component } from "react";

import Login from "./pages/Login/Login";
import { fire } from "./config/firebaseConfig";

import { Redirect } from 'react-router';

import "./styles.css";

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null
    };
  }

  componentDidMount() {
    this.authListener();
  }

  authListener() {
    fire.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ user });
      } else {
        this.setState({ user: null });
      }
    });
  }

  render() {
    return <div className="App">{this.state.user ? <Redirect to={{pathname: "/home"}}/> : <Login />}</div>;
  }
}