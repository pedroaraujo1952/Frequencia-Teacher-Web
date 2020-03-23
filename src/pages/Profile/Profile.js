import React, { Component } from "react";
import { fire } from "../../config/firebaseConfig";
import * as firebase from "firebase/app";

import Header from "../../components/UserHeader/Header";
import Loading from "../../components/Loading/Loading";

import Avatar from "../../assets/profile-user.png";

import "./styles.css";

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.fileInput = React.createRef();
    this.state = {
      user: null,

      username: "",
      avatar: Avatar,
      avatarURL: null,

      edit: false,

      email: "",
      emailError: "",
      pswd: "",
      pswdError: "",

      loading: false
    };
  }

  componentDidMount() {
    this.getUser();
  }

  getUser = async () => {
    let uid,
      username,
      email,
      avatar = "";

    var user = await fire.auth().currentUser;
    if (user) {
      uid = user.uid;
      username = user.displayName ? user.displayName : "Sem nome de usuário";
      email = user.email;
      avatar = user.photoURL;
    }

    const _user = {
      uid: uid,
      username: username,
      email: email,
      avatar: avatar
    };

    this.setState({ user: _user });
  };

  handleChange = ev => {
    this.setState({ [ev.target.name]: ev.target.value });
  };

  handleCancel = ev => {
    ev.preventDefault();
    this.setState({ edit: false, email: "", pswd: "", avatar: Avatar });
  };

  reauthenticate = (email, password) => {
    var user = firebase.auth().currentUser;

    //Create the reauthentication credential
    var credential = firebase.auth.EmailAuthProvider.credential(
      this.state.email,
      this.state.pswd
    );

    //Reauthenticate user to update data
    return user.reauthenticateWithCredential(credential);
  };

  handleConfirm = async ev => {
    ev.preventDefault();

    const state = this.state;

    this.setState({ loading: true });
    console.log(state.avatar);

    this.reauthenticate(state.email, state.pswd).then(() => {
      var user = firebase.auth().currentUser;
      user
        .updateProfile({
          displayName: "",
          photoURL: ""
        })
        .then(() => {
          this.setState({ loading: false });
          window.location.reload();
        })
        .catch(error => {
          console.log(error);
          this.setState({ loading: false });
        });
    });

    console.log("ok");
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
        <Header/>
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
              <p>Email</p>
              <input type="email" name="email" onChange={this.handleChange} />
              <p className="error">{this.state.emailError}</p>

              <p>Senha</p>
              <input type="password" name="pswd" onChange={this.handleChange} />
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
                  this.setState({ edit: true });
                }}
              >
                Editar Perfil
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}
