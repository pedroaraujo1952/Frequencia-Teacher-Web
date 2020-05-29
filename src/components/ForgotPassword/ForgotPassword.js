import React from "react";

import Close from "../../assets/close.png";

import "./styles.css";

const ForgotPassword = ({
  handleClose,
  handleChange,
  handleChangePassword,
  emailError
}) => (
  <div className="forgotPassword popUp">
    <div>
      <div className="header">
        <img src={Close} alt="fechar" id="close-button" onClick={handleClose} />
      </div>
      <div className="body">
        <h4>Esqueceu a Senha</h4>
        <p>
          Por favor, insira o email para o qual a nova senha vai ser enviada
        </p>

        <div className="inputLayout">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />
          <p className="error">{emailError}</p>
        </div>

        <button onClick={handleChangePassword}>ENVIAR</button>
      </div>
    </div>
  </div>
);

export default ForgotPassword;
