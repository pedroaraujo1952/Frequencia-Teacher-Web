import React, { Component } from "react";

import Header from "../../components/UserHeader/Header";
import Loading from "../../components/Loading/Loading";

import * as User from "../../controllers/UserController";

import Avatar from "../../assets/profile-user.png";

import "./styles.css";
import { isLogged } from "../../services/auth";
import { fire } from "../../config/firebaseConfig";
import Error from "../../errors/user.error";

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.fileInput = React.createRef();
    this.state = {
      user: null,

      username: "",
      avatar: Avatar,
      avatarURL: null,

      edit: null,

      firstFieldTitle: "",
      secondFieldTitle: "",

      email: "",
      newEmail: "",
      emailError: "",
      password: "",
      newPassword: "",
      pswdError: "",

      loading: false
    };
  }

  componentDidMount() {
    isLogged();
    this.getUser();
  }

  getUser = async () => {
    var user = await User.getUser();

    this.setState({ user });
  };

  handleChange = ev => {
    this.setState({ [ev.target.name]: ev.target.value });
  };

  handleCancel = ev => {
    ev.preventDefault();
    this.setState({
      edit: false,
      email: "",
      password: "",
      newEmail: "",
      newPassword: "",
      emailError: "",
      pswdError: "",
      avatar: Avatar
    });
  };

  handleConfirm = async ev => {
    ev.preventDefault();

    const state = this.state;
    this.setState({ loading: true });

    console.log(state);

    var user = fire.auth().currentUser;

    if (state.edit === "Email") {
      User.reauthUser(user.email, state.password)
        .then(() => {
          User.changeEmail(state.newEmail).then(
            hasLoaded => {
              window.location.reload();
              this.setState({ loading: !hasLoaded });
            },
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
                  emailError: error.message,
                  pswdError: ""
                });
              else {
                this.setState({
                  loading: false,
                  pswdError: "",
                  emailError: ""
                });
                alert(error);
              }
              this.setState({ loading: false });
            }
          );
        })
        .catch(error => {
          const ERROR = new Error(error);
          console.log(ERROR);
          const errorObject = ERROR.getError;
          if (errorObject.type === "PSWD_ERROR")
            this.setState({
              loading: false,
              pswdError: errorObject.message,
              emailError: ""
            });
          else {
            this.setState({
              loading: false,
              pswdError: "",
              emailError: ""
            });
            alert(errorObject);
          }
          this.setState({ loading: false });
        });
    } else if (state.edit === "Password") {
      User.reauthUser(user.email, state.password).then(() => {
        User.changePassword(state.newPassword).then(
          hasLoaded => {
            window.location.reload();
            this.setState({ loading: !hasLoaded });
          },
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
                emailError: error.message,
                pswdError: ""
              });
            else {
              this.setState({
                loading: false,
                pswdError: "",
                emailError: ""
              });
              alert(error);
            }
            this.setState({ loading: false });
          }
        );
      });
    }

    // User.reauthUser(state.email, state.pswd).then(() => {
    //   User.updateUserProfile("Pedro Araujo", "").then(
    //     hasLoaded => {
    //       window.location.reload();
    //       this.setState({ loading: !hasLoaded });
    //     },
    //     error => {
    //       console.log(error);
    //       this.setState({ loading: false });
    //     }
    //   );
    // });
  };

  //Not implemented with firebase yet
  handleNewAvatar = ev => {
    if (this.fileInput.current.files[0]) {
      const type = this.fileInput.current.files[0].type;

      //Verify if the file is an image
      if (type.indexOf("image") < 0) {
        alert("Por favor, insira somente imagens!");
        return;
      }

      //Change File object to Base64 image
      var a = new FileReader();
      a.readAsDataURL(this.fileInput.current.files[0]);
      a.onloadend = e => {
        var url = e.target.result;
        this.setState({
          avatar: url,
          avatarURL: this.fileInput.current.files[0]
        });
      };
    } else {
      alert("Insira uma imagem");
      return;
    }
  };

  render() {
    return (
      <div>
        {this.state.loading ? <Loading /> : null}
        <Header />
        <div className="userFeed">
          <div>
            {this.state.edit ? (
              <div>
                <label name="icon" htmlFor="newAvatar">
                  <img
                    src={this.state.avatar}
                    alt="Escolher ícone"
                    className="avatar"
                  />
                </label>
                <input
                  id="newAvatar"
                  type="file"
                  name="avatar"
                  ref={this.fileInput}
                  onChange={this.handleNewAvatar}
                />
              </div>
            ) : (
              <img
                src={this.state.avatar}
                alt="Escolher ícone"
                className="avatar"
              />
            )}
          </div>
          <h2>Perfil</h2>

          {this.state.edit ? (
            <form>
              <p>{this.state.firstFieldTitle}</p>
              <input
                type={this.state.edit}
                name={`new${this.state.edit}`}
                onChange={this.handleChange}
              />
              <p className="error">{this.state.emailError}</p>

              <p>{this.state.secondFieldTitle}</p>
              <input
                type="password"
                name="password"
                onChange={this.handleChange}
              />
              <p className="error">{this.state.pswdError}</p>

              <div className="buttonGroup">
                <button id="save" onClick={this.handleConfirm}>
                  Salvar
                </button>
                <button id="cancel" onClick={this.handleCancel}>
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <div style={{ display: "block" }}>
              <p>{this.state.user ? this.state.user.username : null}</p>
              <p>{this.state.user ? this.state.user.email : null}</p>
              <button
                onClick={ev => {
                  ev.preventDefault();
                  this.setState({
                    edit: "Email",
                    firstFieldTitle: "Novo Email",
                    secondFieldTitle: "Senha atual"
                  });
                }}
              >
                Alterar Email
              </button>
              <button
                style={{ marginTop: "20px" }}
                onClick={ev => {
                  ev.preventDefault();
                  this.setState({
                    edit: "Password",
                    firstFieldTitle: "Nova Senha",
                    secondFieldTitle: "Senha Atual"
                  });
                }}
              >
                Alterar Senha
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}
