import React, { Component } from "react";

import Logo from "../../assets/Logok.png";
import Back from "../../assets/back.png";
import { NavLink } from "react-router-dom";

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ""
    };
  }

  componentWillMount = () => {
    this.setState({
      text: this.props.info
    });
  };

  render() {
    return (
      <div className="header">
        <div className="backImage">
          <NavLink to="/">
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
            />
          </NavLink>
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
          <h1>{this.state.text}</h1>
        </div>
      </div>
    );
  }
}
