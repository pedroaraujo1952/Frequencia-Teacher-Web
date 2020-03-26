import React, { Component } from "react";
import { fire } from "../../config/firebaseConfig";

import Header from "../../components/CreateEventHeader/Header";
import Loading from "../../components/Loading/Loading";

import { Redirect } from 'react-router';

import "./styles.css";

export default class CreateEvent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      backHome: false,
      name: '',
      date: '',
      description: '',
      hourBegin: '',
      minutesBegin: '',
      hourEnd: '',
      minutesEnd: '',
      word: '',
      notifyHour: '',
      keyWord: []
    };
  }

  componentDidMount() {
    this.getUser();
    console.log(this.state.user);
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

  handleAddWord = ev => {
    ev.preventDefault();
    var word = this.state.word + ', ' + this.state.notifyHour;
    const { keyWord } = this.state;
    keyWord.push(word); 
    this.setState({keyWord})
  };

  handleChange = ev => {
    this.setState({ [ev.target.name]: ev.target.value });
  };

  /*reauthenticate = (email, password) => {
    var user = firebase.auth().currentUser;

    //Create the reauthentication credential
    var credential = firebase.auth.EmailAuthProvider.credential(
      this.state.email,
      this.state.pswd
    );

    //Reauthenticate user to update data
    return user.reauthenticateWithCredential(credential);
  };*/

  /*handleConfirm = async ev => {
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
  };*/

  render() {
    if(this.state.backHome) {
      return <Redirect to="/"/>
    }
    return (
        <div>{this.state.loading ? <Loading /> : null}
            <Header/>{/*<Header avatar={this.state.avatarURL}/>*/}
            <div className="newEvent">
                <div className="title">
                    <h1>Título</h1>
                    <input type="text" name="title" onChange={this.handleChange}/>
                </div>
                <div className="timeBegin">
                    <h1>Horário de Início</h1>
                    <input type="text" name="hourBegin" onChange={this.handleChange}/>
                    <h2 name="h">h</h2>
                    <input type="text" name="minutesBegin" onChange={this.handleChange}/>
                    <h2 name="min">min</h2>
                </div>
                <div className="timeEnd">
                    <h1>Horário de Término</h1>
                    <input type="text" name="hourEnd" onChange={this.handleChange}/>
                    <h2 name="h">h</h2>
                    <input type="text" name="minutesEnd" onChange={this.handleChange}/>
                    <h2 name="min">min</h2>
                </div>
                <div className="date">
                    <h1>Data</h1>
                    <input type="text" name="date" onChange={this.handleChange}/>
                </div>
                <div className="keyWords">
                    <h1>Palavras-passe</h1>
                    <input type="text" name="word" placeholder="Palavra" onChange={this.handleChange}/>
                    <input type="text" name="notifyHour" placeholder="Horário da notificação" onChange={this.handleChange}/>
                    <h2 name="button" onClick={this.handleAddWord}>+</h2>
                    <div className="words">
                        {this.state.keyWord.map((k) => (
                            <h2>{k}</h2>
                        ))}
                    </div>
                </div>
                <div className="description">
                    <h1>Descrição</h1>
                    <input type="text" name="description" onChange={this.handleChange}/>
                </div>
                <div className="saveButton">
                    <button
                        /*onClick={ev => {
                          ev.preventDefault();
                        }}*/
                    >
                    <h2>Salvar</h2> 
                    </button>
                </div>
                <div className="cancelButton">
                    <button
                        onClick={ev => {
                          ev.preventDefault();
                          this.setState({backHome: true});
                        }}
                    >
                    <h2>Cancelar</h2> 
                    </button>
                </div>
            </div>
        </div>
    );
  }
}