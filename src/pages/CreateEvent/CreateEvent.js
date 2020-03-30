import React, { Component } from "react";
import { Redirect } from "react-router";
import MaskedInput from "react-text-mask";

import { messaging, fire } from "../../config/firebaseConfig";

import * as Event from "../../controllers/EventController";

import Header from "../../components/CreateEventHeader/Header";

import "./styles.css";

var cont_keys;

export default class CreateEvent extends Component {
  constructor(props) {
    super(props);
    cont_keys = 0;
    this.state = {
      nameClass: this.props.nameClass,
      backHome: false,
      name: "",
      link: "",
      date: "",
      description: "",
      hourBegin: "",
      minutesBegin: "",
      hourEnd: "",
      minutesEnd: "",
      word: "",
      notifyHour: "",
      keyWord: ["", "", ""],
      notifTime: ["", "", ""],
      key: "",
      info: ""
    };
  }

  componentWillMount = async () => {
    if (this.props.editEvent) {
      this.setState({
        id: this.props.eventToEdit.id,
        name: this.props.eventToEdit.title,
        date: this.props.eventToEdit.date,
        description: this.props.eventToEdit.description,
        students: this.props.eventToEdit.students,
        key: this.props.eventToEdit.keys,
        link: this.props.eventToEdit.link,
        hourBegin: this.props.eventToEdit.begin.substring(0, 2),
        minutesBegin: this.props.eventToEdit.begin.substring(3, 5),
        hourEnd: this.props.eventToEdit.end.substring(0, 2),
        minutesEnd: this.props.eventToEdit.end.substring(3, 5),
        info: "Editar evento"
      });
    } else {
      this.setState({
        info: "Novo evento"
      });
    }
  };

  handleAddWord = ev => {
    ev.preventDefault();
    var el = document.getElementsByClassName("warningNotifyHour");
    var h = parseInt(this.state.notifyHour.substring(0, 2));
    var min = parseInt(this.state.notifyHour.substring(3, 5));
    if (
      this.state.word === "" ||
      this.state.notifyHour === "" ||
      this.state.hourBegin === "" ||
      this.state.minutesBegin === "" ||
      this.state.hourEnd === "" ||
      this.state.minutesEnd === ""
    ) {
      el[0].style.display = "block";
    } else if (
      h > parseInt(this.state.hourEnd) ||
      h < parseInt(this.state.hourBegin) ||
      (h === parseInt(this.state.hourEnd) &&
        min >= parseInt(this.state.minutesEnd)) ||
      (h === parseInt(this.state.hourBegin) &&
        min <= parseInt(this.state.minutesBegin))
    ) {
      el[0].style.display = "block";
    } else if (cont_keys !== 3) {
      el[0].style.display = "none";
      var word = this.state.word;
      var notif = this.state.notifyHour;
      const { keyWord, notifTime } = this.state;
      keyWord[cont_keys] = word;
      notifTime[cont_keys] = notif;
      cont_keys++;
      this.setState({ keyWord, notifTime });
    }
  };

  handleChange = ev => {
    this.setState({ [ev.target.name]: ev.target.value });
  };

  verify = ev => {
    ev.preventDefault();
    var el = document.getElementsByClassName("warning");
    var d = parseInt(this.state.date.substring(0, 2));
    var m = parseInt(this.state.date.substring(3, 5));
    var y = parseInt(this.state.date.substring(6, 8));
    if (
      this.state.name === "" ||
      this.state.hourBegin === "" ||
      this.state.minutesBegin === "" ||
      this.state.hourEnd === "" ||
      this.state.minutesEnd === "" ||
      this.state.date === "" ||
      this.state.keyWord === [] ||
      this.state.description === ""
    ) {
      el[0].style.display = "block";
    } else if (
      parseInt(this.state.hourEnd) >= 24 ||
      parseInt(this.state.minuteEnd) >= 60 ||
      parseInt(this.state.hourBegin) >= 24 ||
      parseInt(this.state.minuteBegin) >= 60
    ) {
      el[0].style.display = "block";
    } else if (d > 31 || m > 12 || y !== 20) {
      el[0].style.display = "block";
    } else if (cont_keys === 0) {
      el[0].style.display = "block";
    } else {
      el[0].style.display = "none";
      this.sendEvent();
    }
  };

  sendEvent = async () => {
    await Event.createEvent(this.state).then(
      () => {},
      error => this.setState({ backHome: true })
    );
    this.setState({ backHome: true });
    this.createNotification();
  };

  createNotification = async () => {
  }

  handleEditEvent = async () => {
    await Event.updateEvent(this.state).then(
      () => {},
      error => this.setState({ backHome: true })
    );
    this.setState({ backHome: true });
  };

  render() {
    if (this.state.backHome) {
      return <Redirect to="/" />;
    }
    return (
      <div className="newEventBody">
        <Header />
        <div className="newEvent">
          <div className="title">
            <div>
              <h1>Título</h1>
              <input
                type="text"
                name="name"
                onChange={this.handleChange}
                defaultValue={this.state.name}
              />
            </div>

            <div>
              <h1>Link do Meeting</h1>
              <input
                type="text"
                name="link"
                onChange={this.handleChange}
                defaultValue={this.state.link}
              />
            </div>
          </div>
          <div className="timeBegin">
            <h1>Horário de Início</h1>
            <MaskedInput
              name="hourBegin"
              mask={[/[0-9]/, /\d/]}
              onChange={this.handleChange}
              defaultValue={this.state.hourBegin}
            />
            <h2 name="h">h</h2>
            <MaskedInput
              name="minutesBegin"
              mask={[/[0-9]/, /\d/]}
              onChange={this.handleChange}
              defaultValue={this.state.minutesBegin}
            />
            <h2 name="min">min</h2>
          </div>
          <div className="timeEnd">
            <h1>Horário de Término</h1>
            <MaskedInput
              name="hourEnd"
              mask={[/[0-9]/, /\d/]}
              onChange={this.handleChange}
              defaultValue={this.state.hourEnd}
            />
            <h2 name="h">h</h2>
            <MaskedInput
              name="minutesEnd"
              mask={[/[0-9]/, /\d/]}
              onChange={this.handleChange}
              defaultValue={this.state.minutesEnd}
            />
            <h2 name="min">min</h2>
          </div>
          <div className="date">
            <h1>Data</h1>
            <MaskedInput
              name="date"
              mask={[/[0-9]/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/]}
              onChange={this.handleChange}
              defaultValue={this.state.date}
            />
          </div>
          <div className="keyWords">
            <div className="warningNotifyHour">
              <h2 name="msgWarning">
                *Informe um horário entre o intervalo da aula
              </h2>
            </div>
            <h1>Palavras-passe</h1>
            <input
              type="text"
              name="word"
              placeholder="Palavra"
              onChange={this.handleChange}
            />
            <MaskedInput
              name="notifyHour"
              placeholder="Horário da notificação"
              mask={[/[0-9]/, /\d/, "h", /\d/, /\d/, "min"]}
              onChange={this.handleChange}
            />
            <h2 name="button" onClick={this.handleAddWord}>
              +
            </h2>
            <div className="words">
              {this.state.keyWord.map((k, index) => (
                <h2 key={index}>{k}</h2>
              ))}
            </div>
          </div>
          <div className="description">
            <h1>Descrição</h1>
            <input
              type="text"
              name="description"
              onChange={this.handleChange}
              defaultValue={this.state.description}
            />
          </div>
          <div className="buttonGroup">
            <div className="saveButton">
              <button
                onClick={
                  this.props.editEvent ? this.handleEditEvent : this.verify
                }
              >
                <h2>Salvar</h2>
              </button>
            </div>
            <div className="warning">
              <h2 name="msgWarning">*Preencha todos os campos corretamente</h2>
            </div>
            <div className="cancelButton">
              <button
                onClick={ev => {
                  ev.preventDefault();
                  this.setState({ backHome: true });
                }}
              >
                <h2>Cancelar</h2>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
