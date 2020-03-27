import React, { Component } from "react";

import Logo from "../../assets/Logok.png";
import Back from "../../assets/back.png";

import "./styles.css";
import { fire, database } from "../../config/firebaseConfig";
import * as User from "../../controllers/UserController";
import { Redirect } from "react-router-dom";
import Loading from "../../components/Loading/Loading";

export default class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      subject: "",
      email: "",
      emailError: "",
      pswd: "",
      pswdError: "",
      pswdConfirm: "",
      pswdConfirmError: "",

      stats: false
    };
  }

  handleChange = ev => {
    this.setState({ [ev.target.name]: ev.target.value });
  };

  handleSignup = async ev => {
    ev.preventDefault();

    this.setState({ loading: true });

    await User.createUser(this.state).then(
      stats => this.setState({ stats, loading: !stats }),
      error => {
        if (error.type === "EMAIL_ERROR")
          this.setState({
            loading: false,
            emailError: error.message,
            pswdError: "",
            pswdConfirmError: ""
          });
        else if (error.type === "PSWD_ERROR")
          this.setState({
            loading: false,
            pswdError: error.message,
            pswdConfirmError: error.message,
            emailError: ""
          });
        else {
          this.setState({
            loading: false,
            pswdError: "",
            emailError: "",
            pswdConfirmError: ""
          });
          alert(error);
        }
      }
    );

    // const { name, subject, email, pswd, pswdConfirm } = this.state;

    // if (pswd === pswdConfirm) {
    //   const user = {
    //     name: name,
    //     subject: subject,
    //     email: email
    //   };

    //   await fire
    //     .auth()
    //     .createUserWithEmailAndPassword(email, pswd)
    //     .then(async () => {
    //       const uid = await fire.auth().currentUser.uid;

    //       await database
    //         .ref(`professores/${uid}`)
    //         .set(user)
    //         .then(async () => {
    //           await User.updateUserName(name).then(
    //             stats => this.setState({ stats: stats, loading: false }),
    //             err => {
    //               alert(err);
    //               this.setState({ loading: false });
    //             }
    //           );
    //         });
    //     })
    //     .catch(err => {
    //       alert(err);
    //       this.setState({ loading: false });
    //     });
    // } else {
    //   console.log("senha n bate");
    // }
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
              style={{
                border: "3px solid #043f5f",
                borderRadius: "100%",
                padding: "2px",
                maxHeight: "100px",
                minHeight: "100px",
                maxWidth: "100px",
                minWidth: "100px"
              }}
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
                  emailError: ""
                })
              }
            />
          </div>
        </header>

        <form>
          <div className="logo">
            <img src={Logo} alt="" />
            <h1>CADASTRO</h1>
          </div>
          <p>Nome</p>
          <input type="text" name="name" onChange={this.handleChange} />

          <p>Materia</p>
          <input type="text" name="subject" onChange={this.handleChange} />

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

          <button onClick={this.handleSignup}>CADASTRAR</button>
        </form>
      </div>
    );
  }
}
