import React, { Component } from "react";

import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import { fire } from "./config/firebaseConfig";

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
      students_
  ){
      this.name = name_;
      this.date = date_;
      this.description = description_;
      this.timeBegin = timeBegin_;
      this.timeEnd = timeEnd_;
      this.keyWord = keyWord_;
      this.students = students_;
  }
}

var classes = [];

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null
    };
  }

  componentDidMount() {
    this.authListener();
  }

  authListener = ev => {
    fire.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ user });
        var userId = user.uid;
        var cont = 0;
        fire.database().ref('professores/' + userId + '/events').on('value', function(snapshot) {
          snapshot.forEach(function (nameClass) {
            classes[cont++] = new Class(nameClass.key, []);
              fire.database().ref('professores/' + userId + '/events/' + nameClass.key).on('value', function(snapshot) {
                snapshot.forEach(function (event) {
                  var name = event.key;
                  var date = event.val().date;
                  var description = event.val().description;
                  var timeBegin = event.val().begin;
                  var timeEnd = event.val().end;
                  var keyWord = '';
                  if(event.val().keys.key1 !== '')keyWord += event.val().keys.key1;
                  if(event.val().keys.key2 !== '')keyWord += (', ' + event.val().keys.key2);
                  if(event.val().keys.key3 !== '')keyWord += (', ' + event.val().keys.key3);
                  var students = event.val().students;
                  var event_ = new Event(name, date, description, timeBegin, timeEnd, keyWord, students);
                  classes[cont-1].events.push(event_);
                })
              });
          })
        });
      } else {
        this.setState({ user: null });
      }
    });
  }

  render() {
    return <div className="App">{this.state.user ? <Home classes={classes}/> : <Login />}</div>;
  }
}