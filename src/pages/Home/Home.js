import React, { Component } from "react";
import { fire } from "../../config/firebaseConfig";

import Header from "../../components/HomeHeader/Header";
import CreateEvent from "../CreateEvent/CreateEvent";

import Avatar from "../../assets/profile-user.png";

import { Redirect } from 'react-router';

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
        students_,
        key_
    ){
        this.name = name_;
        this.date = date_;
        this.description = description_;
        this.timeBegin = timeBegin_;
        this.timeEnd = timeEnd_;
        this.keyWord = keyWord_;
        this.students = students_;
        this.key = key_;
    }
}

var new_event_class = "";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      goLogin: false,
      username: "",
      avatar: Avatar,
      avatarURL: null,

      edit: false,

      email: "",
      emailError: "",
      pswd: "",
      pswdError: "",

      loading: false,
      classes: [],
      new_event: false
    };
  }

  componentDidMount() {
    try {
    var userId = fire.auth().currentUser.uid;
    var cont = 0;
    var { classes } = this.state;
    fire.database().ref('professores/' + userId + '/events').on('value', function(snapshot) {
      snapshot.forEach(function (nameClass) {
        classes[cont++] = new Class(nameClass.key, []);
          fire.database().ref('professores/' + userId + '/events/' + nameClass.key).on('value', function(snapshot) {
            snapshot.forEach(function (event) {
                if(event.key !== 'evento0'){
                    var name = "Aula";
                    var date = event.val().date;
                    var description = event.val().description;
                    var timeBegin = event.val().begin;
                    var timeEnd = event.val().end;
                    var keyWord = '';
                    var i;
                    if(event.val().keys.key1 !== ''){
                        i = String(event.val().keys.key1).indexOf(',');
                        keyWord += event.val().keys.key1.substring(0,i);
                    }
                    if(event.val().keys.key2 !== ''){
                        i = String(event.val().keys.key2).indexOf(',');
                        keyWord += (', ' + event.val().keys.key2.substring(0,i));
                    }
                    if(event.val().keys.key3 !== ''){
                        i = String(event.val().keys.key3).indexOf(',');
                        keyWord += (', ' + event.val().keys.key3.substring(0,i));
                    }
                    var students = event.val().students;
                    var event_ = new Event(name, date, description, timeBegin, timeEnd, keyWord, students, event.key);
                    classes[cont-1].events.push(event_);
                }
            })
          });
      })
    });
    this.setState({classes});
    } catch (e) {
        fire.auth().signOut();
        this.setState({goLogin: true});
    }
 }

  handleChange = ev => {
    this.setState({ [ev.target.name]: ev.target.value });
  };

  render() {
    if(this.state.goLogin) {
        return <Redirect to={{pathname: "/"}}/>
    }
    return (
        <div>
        {this.state.new_event ? <CreateEvent nameClass={new_event_class}/> :
        <div><Header/>
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
                                    <button>
                                    <h1>Editar evento</h1> 
                                    </button>
                                </div>
                                <div className="deleteEvent">
                                    <button onClick={ ev => {
                                        ev.preventDefault();
                                        var user = fire.auth().currentUser;
                                        var userId = user.uid;
                                        if(e.key !== 'evento0'){
                                            fire.database().ref()
                                                .child('professores/' + userId + '/events/' + c.name)
                                                .child(e.key).remove();
                                            this.setState({goLogin: true});
                                        }
                                    }}>
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
                    <button onClick={ ev => {
                        ev.preventDefault();
                        new_event_class = c.name;
                        this.setState({new_event: true});
                    }}>
                    <h1>+ Criar evento</h1> 
                    </button>
                    </div>
                </div>
            ))}
        </div>
        </div>}
        </div>
    );
  }
}