import React, { Component }  from "react";

import Logo from "../../assets/Logok.png";
import Back from "../../assets/back.png";

import { Redirect } from 'react-router';

import "./styles.css";

export default class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {
      goHome: false
    };
  }

  back = ev => {
    ev.preventDefault();
    this.setState({goHome: true})
  };

  render() {
    if (this.state.goHome) {
      return <Redirect to={{pathname: "/home"}}/>;
    }
    return(
      <div className="header">
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
          onClick={this.back}
          />
        </div>
        <img 
          src={Logo} 
          alt=""
          style={{
            height: "100px",
            width: "100px",
            padding: "2px"
          }} 
        />
      </div>
    );
  }
}
