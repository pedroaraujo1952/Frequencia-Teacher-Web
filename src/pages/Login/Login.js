import React, { Component } from "react";

import Loading from "../../components/Loading/Loading";
import ForgotPassword from "../../components/ForgotPassword/Forgot";

import * as User from "../../controllers/UserController";

import Logo from "../../assets/Logok.png";

import "./styles.css";
import { NavLink } from "react-router-dom";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      emailError: "",
      emailRecoverError: "",

      pswd: "",
      pswdError: "",

      loading: false,

      popUpStats: false
    };
  }

  handleClick = async ev => {
    ev.preventDefault();
    this.setState({ loading: true });

    await User.login(this.state.email, this.state.pswd).then(
      login => {},
      error => {
        if (error.type === "EMAIL_ERROR")
          this.setState({
            loading: false,
            emailError: error.message,
            pswdError: ""
          });
        else if (error.type === "PSWD_ERROR")
          this.setState({
            loading: false,
            pswdError: error.message,
            emailError: ""
          });
        else {
          this.setState({
            loading: false,
            pswdError: "",
            emailError: ""
          });
          alert(error);
        }
      }
    );
  };

  handleChange = ev => {
    this.setState({ [ev.target.name]: ev.target.value });
  };

  handleForgotPassword = () => {
    this.setState({ popUpStats: true });
  };

  handleClose = ev => {
    ev.preventDefault();
    this.setState({ popUpStats: false, emailRecoverError: "" });
  };

  handleChangePassword = async ev => {
    ev.preventDefault();

    const { email } = this.state;

    await User.forgotPassword(email).then(
      message => {
        this.setState({ popUpStats: false, emailRecoverError: "" });
        alert(message);
      },
      error => {
        if (error.type === "EMAIL_ERROR")
          this.setState({
            emailRecoverError: error.message
          });
        else {
          alert(error);
        }
      }
    );

    // await fire
    //   .auth()
    //   .sendPasswordResetEmail(email)
    //   .then(
    //     (message = `Email enviado para ${email}\nVerifique sua caixa de mensagens`)
    //   )
    //   .catch(error => {
    //     if (error.code === "auth/user-not-found") {
    //       this.setState({
    //         emailRecoverError: "Usuário não encontrado"
    //       });
    //       message = "";
    //     } else if (error.code === "auth/invalid-email") {
    //       this.setState({ emailRecoverError: "Email inválido" });
    //       message = "";
    //     }
    //     message = "";
    //   });
    // if (message.length > 2) {
    //   alert(message);
    //   this.setState({ popUpStats: false });
    // }
  };

  render() {
    return (
      <div className="loginScreen">
        {this.state.loading ? <Loading /> : null}
        {this.state.popUpStats ? (
          <ForgotPassword
            handleClose={this.handleClose}
            handleChange={this.handleChange}
            handleChangePassword={this.handleChangePassword}
            emailError={this.state.emailRecoverError}
          />
        ) : null}
        <form>
          <div className="logo">
            <img src={Logo} alt="" />
            <div>
              <h1>FREQUÊNCIA</h1>
              <h4>Fundação Matias Machline</h4>
            </div>
          </div>

          <div>
            <p>Email</p>
            <input type="email" name="email" onChange={this.handleChange} />
            <p className="error">{this.state.emailError}</p>
          </div>

          <div>
            <p>Senha</p>
            <input type="password" name="pswd" onChange={this.handleChange} />
            <p className="error">{this.state.pswdError}</p>

            <div
              className="linksContainer"
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                margin: "0"
              }}
            >
              <p
                style={{ marginTop: "5px" }}
                className="link"
                onClick={this.handleForgotPassword}
              >
                Esqueci minha senha
              </p>

              <NavLink
                style={{ marginTop: "5px", textAlign: "end" }}
                activeClassName="link"
                className="link"
                onClick={this.handleForgotPassword}
                to="/signup"
              >
                Cadastrar
              </NavLink>
            </div>
          </div>

          <button onClick={this.handleClick}>Entrar</button>
        </form>
      </div>
    );
  }
}
