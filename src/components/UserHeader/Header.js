import React from "react";

import { fire } from "../../config/firebaseConfig";

import Logo from "../../assets/Logok.png";
import Back from "../../assets/back.png";

import "./styles.css";

const logout = ev => {
  ev.preventDefault();
  fire.auth().signOut();
};

const Header = () => (
  <div className="header">
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
      onClick={logout}
    />
    <img src={Logo} alt="" />
  </div>
);

export default Header;
