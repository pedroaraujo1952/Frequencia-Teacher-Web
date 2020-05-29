import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import * as User from "../../controllers/UsersController";

import Loading from "../../components/Loading/Loading";
import MultipleSelect from "../../components/MultipleSelect/MultipleSelect";

import Logo from "../../assets/Logok.png";
import Back from "../../assets/back.png";

import "./styles.css";

export default class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      subject: [],
      email: "",
      emailError: "",
      pswd: "",
      pswdError: "",
      pswdConfirm: "",
      pswdConfirmError: "",

      stats: false,
    };
  }

  handleChange = (ev) => {
    this.setState({ [ev.target.name]: ev.target.value });
  };

  handleSignup = async (ev) => {
    ev.preventDefault();

    this.setState({ loading: true });

    await User.createUser(this.state).then(
      (stats) => this.setState({ stats, loading: !stats }),
      (error) => {
        if (error.type === "EMAIL_ERROR")
          this.setState({
            loading: false,
            emailError: error.message,
            pswdError: "",
            pswdConfirmError: "",
          });
        else if (error.type === "PSWD_ERROR")
          this.setState({
            loading: false,
            pswdError: error.message,
            pswdConfirmError: error.message,
            emailError: "",
          });
        else {
          this.setState({
            loading: false,
            pswdError: "",
            emailError: "",
            pswdConfirmError: "",
          });
          alert(error.message);
        }
      }
    );
  };

  render() {
    if (this.state.stats) {
      return <Redirect to="/" />;
    }

    return (
      <div className="register">
        {this.state.loading ? <Loading /> : null}

        <header>
          <div className="backImage" style={{ margin: 0, padding: "3%" }}>
            <img
              src={Back}
              alt="voltar"
              onClick={() =>
                this.setState({
                  stats: true,
                  name: "",
                  subject: "",
                  pswd: "",
                  pswdError: "",
                  pswdConfirm: "",
                  pswdConfirmError: "",
                  email: "",
                  emailError: "",
                })
              }
            />
          </div>
        </header>

        <form className="registerForm">
          <div className="logo">
            <img src={Logo} alt="" />
            <h1>CADASTRO</h1>
          </div>
          <p>Nome</p>
          <input type="text" name="name" onChange={this.handleChange} />

          <p>Materia</p>
          <MultipleSelect
            name="subject"
            onChange={this.handleChange}
            onMultipleChange={this.handleMultipleChange}
            value={this.state.subject}
          />

          <p>Email</p>
          <input type="email" name="email" onChange={this.handleChange} />
          <p className="error">{this.state.emailError}</p>

          <p>Senha</p>
          <input type="password" name="pswd" onChange={this.handleChange} />
          <p className="error">{this.state.pswdError}</p>

          <p>Confirmar Senha</p>
          <input
            type="password"
            name="pswdConfirm"
            onChange={this.handleChange}
          />
          <p className="error">{this.state.pswdError}</p>

          <button onClick={this.handleSignup} style={{ fontSize: "14px" }}>
            CADASTRAR
          </button>
        </form>
      </div>
    );
  }
}
