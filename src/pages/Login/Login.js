import React, { Component } from "react";

import Loading from "../../components/Loading/Loading";
import { fire } from "../../config/firebaseConfig";

import Logo from "../../assets/Logok.png";

import "./styles.css";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      emailError: "",
      pswd: "",
      pswdError: "",
      loading: false
    };
  }

  handleClick = async ev => {
    ev.preventDefault();
    this.setState({ loading: true });
    await setTimeout(() => {
      fire
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.pswd)
        .then(this.setState({ loading: false }))
        .catch(error => {
          this.setState({ loading: false });
          if (error.code === "auth/user-not-found") {
            this.setState({
              emailError: "Usuário não encontrado",
              pswdError: ""
            });
          } else if (error.code === "auth/invalid-email") {
            this.setState({ emailError: "Email inválido", pswdError: "" });
          } else if (error.code === "auth/wrong-password") {
            this.setState({ pswdError: "Senha inválida", emailError: "" });
          }
        });
    }, 1200);
  };

  handleChange = ev => {
    this.setState({ [ev.target.name]: ev.target.value });
  };

  render() {
    return (
      <div className="loginScreen">
        {this.state.loading ? <Loading /> : null}
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

            <p style={{ marginTop: "5px" }}>
              {/* eslint-disable-next-line */}
              <a href="" target="_blank">
                Esqueci minha senha
              </a>
            </p>
          </div>

          <button onClick={this.handleClick}>Entrar</button>
        </form>
      </div>
    );
  }
}
