import React, { Component } from "react";

import { fire } from "../../config/firebaseConfig";

import Logo from "../../assets/Logok.png";
import Back from "../../assets/back.png";
import Avatar from "../../assets/profile-user.png";

import { Redirect } from "react-router";

import "./styles.css";

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      goProfile: false,
      user: null
    };
  }

  logout = ev => {
    ev.preventDefault();
    fire.auth().signOut();
  };

  profile = ev => {
    ev.preventDefault();
    this.setState({ goProfile: true });
  };

  render() {
    if (this.state.goProfile) {
      return <Redirect to="/profile" />;
    }
    if (this.state.user) {
      return <Redirect to="/" />;
    }
    return (
      <div className="homeHeader">
        <div className="backImage">
          <img
            src={Back}
            alt="voltar"
            style={{
              border: "3px solid #043f5f",
              borderRadius: "100%",
              height: "80px",
              width: "80px",
              padding: "2px"
            }}
            onClick={this.logout}
          />
        </div>

        <div className="logoImage">
          <img
            src={Logo}
            alt=""
            style={{
              height: "130px",
              width: "130px",
              padding: "2px"
            }}
          />
        </div>

        <div className="textoLogo">
          <h1>Turmas</h1>
        </div>

        <div className="avatarImage">
          <img
            src={Avatar}
            alt="perfil"
            style={{
              height: "80px",
              width: "80px",
              padding: "2px"
            }}
            onClick={this.profile}
          />
        </div>
      </div>
    );
  }
}
