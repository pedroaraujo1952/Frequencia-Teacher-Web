import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import Loading from "../../components/Loading/Loading";
import ForgotPassword from "../../components/ForgotPassword/Forgot";

import * as User from "../../controllers/UserController";

import Logo from "../../assets/Logok.png";
import Info from "../../assets/info.png";

import "./styles.css";

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

      popUpStats: false,
    };
  }

  handleClick = async (ev) => {
    ev.preventDefault();
    this.setState({ loading: true });

    await User.login(this.state.email, this.state.pswd).then(
      (login) => {},
      (error) => {
        if (error.type === "EMAIL_ERROR")
          this.setState({
            loading: false,
            emailError: error.message,
            pswdError: "",
          });
        else if (error.type === "PSWD_ERROR")
          this.setState({
            loading: false,
            pswdError: error.message,
            emailError: "",
          });
        else {
          this.setState({
            loading: false,
            pswdError: "",
            emailError: "",
          });
          alert(error);
        }
      }
    );
  };

  handleChange = (ev) => {
    this.setState({ [ev.target.name]: ev.target.value });
  };

  handleForgotPassword = () => {
    this.setState({ popUpStats: true });
  };

  handleClose = (ev) => {
    ev.preventDefault();
    this.setState({ popUpStats: false, emailRecoverError: "" });
  };

  handleChangePassword = async (ev) => {
    ev.preventDefault();

    const { email } = this.state;

    await User.forgotPassword(email).then(
      (message) => {
        this.setState({ popUpStats: false, emailRecoverError: "" });
        alert(message);
      },
      (error) => {
        if (error.type === "EMAIL_ERROR")
          this.setState({
            emailRecoverError: error.message,
          });
        else {
          alert(error);
        }
      }
    );
  };

  render() {
    return (
      <div className="loginScreen">
        <Loading loading={this.state.loading} />
        {this.state.popUpStats ? (
          <ForgotPassword
            handleClose={this.handleClose}
            handleChange={this.handleChange}
            handleChangePassword={this.handleChangePassword}
            emailError={this.state.emailRecoverError}
          />
        ) : null}
        <NavLink to="/about" className="infoIcon">
          <img src={Info} alt="informações" className="infoIcon" />
        </NavLink>
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
                margin: "0",
              }}
            >
              <p
                style={{ marginTop: "5px", cursor: "pointer", width: "170px" }}
                className="link"
                onClick={this.handleForgotPassword}
              >
                Esqueci minha senha
              </p>

              <NavLink
                style={{ marginTop: "5px", textAlign: "end", width: "75px" }}
                activeClassName="link"
                className="link"
                onClick={this.handleForgotPassword}
                to="/signup"
              >
                Cadastrar
              </NavLink>
            </div>
          </div>
          <div className="button-form">
            <button onClick={this.handleClick}>Entrar</button>
          </div>
        </form>
      </div>
    );
  }
}
