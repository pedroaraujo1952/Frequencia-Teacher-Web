import React, { Component } from "react";
import { fire } from "../../config/firebaseConfig";

import Header from "../../components/HomeHeader/Header";
import Loading from "../../components/Loading/Loading";

import Avatar from "../../assets/profile-user.png";

import "./styles.css";

class Class {
    constructor(name_, events_) {
        this.name = name_;
        this.events = events_;
    }
}

class Event {
    constructor(
        name_,
        date_,
        description_,
        timeBegin_,
        timeEnd_,
        keyWord_,
        frequence_
    ){
        this.name = name_;
        this.date = date_;
        this.description = description_;
        this.timeBegin = timeBegin_;
        this.timeEnd = timeEnd_;
        this.keyWord = keyWord_;
        this.frequence = frequence_;
    }
}


export default class Home extends Component {
  constructor(props) {
    super(props);

    /*
    Understanding the model:

    1. Create a class using new Class
        
        1.1. Parameters: class name and related events
        
        1.2. Create an event using new Event
            
            1.2.1. Parameters: event's name, date, description, 
                            start time, end time, key word, 
                            and related students (to do) 
    */

    var classes = [];
    classes[0] = new Class("3ºAI", []);
    classes[1] = new Class("3ºBI", []);
    classes[2] = new Class("3ºCI", [new Event(
        "Ponto e Reta", "22/03/2020", "lalala lala lala lala", "07h10", "08h00", "Flor", null)]);

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

      loading: false,
      classes: classes
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
    return (
        <div>{this.state.loading ? <Loading /> : null}
        <Header/>{/*<Header avatar={this.state.avatarURL}/>*/}
        <div className="homeFeed">
            {this.state.classes.map((c) => (
                <div className="rectanguleClass" key={c.name}>
                    <div className="nameClass">
                        <h1>{c.name}</h1>
                    </div>
                    <div className="events">
                        {c.events.map((e) => (
                            <div className="rectanguleEvent" key={e.name}>
                                <div className="nameEvent">
                                    <h2>{e.name}</h2>
                                </div>
                                <div className="dateEvent">
                                    <h2>{e.date}</h2>
                                </div>
                                <div className="line"/>
                                <div className="descriptionEvent">
                                    <h2>Descrição: {e.description}</h2>
                                </div>
                                <div className="timeBeginEvent">
                                    <h2>Início: {e.timeBegin}</h2>
                                </div>
                                <div className="timeEndEvent">
                                    <h2>Fim: {e.timeEnd}</h2>
                                </div>
                                <div className="keyWordEvent">
                                    <h2>Palavra-passe: {e.keyWord}</h2>
                                </div>
                                <div className="editEvent">
                                    <button
                                        /*onClick={ev => {
                                        ev.preventDefault();
                                        }*/
                                    >
                                    <h1>Editar evento</h1> 
                                    </button>
                                </div>
                                <div className="deleteEvent">
                                    <button
                                        /*onClick={ev => {
                                        ev.preventDefault();
                                        }*/
                                    >
                                    <h1>Excluir evento</h1> 
                                    </button>
                                </div>
                                <div className="frequenceEvent">
                                <button
                                    /*onClick={ev => {
                                    ev.preventDefault();
                                    }*/
                                >
                                <h1>Frequência</h1> 
                                </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="createEvent">
                    <button
                        /*onClick={ev => {
                        ev.preventDefault();
                        }*/
                    >
                    <h1>+ Criar evento</h1> 
                    </button>
                    </div>
                </div>
            ))}
        </div>
        </div>
    );
  }
}