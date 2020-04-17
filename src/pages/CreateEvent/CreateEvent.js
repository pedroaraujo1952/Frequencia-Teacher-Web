import React, { Component } from "react";
import { Redirect } from "react-router";
import MaskedInput from "react-text-mask";

import * as Event from "../../controllers/EventController";

import Select from "../../components/Select/Select";
import Loading from "../../components/Loading/Loading";

import Logo from "../../assets/Logok.png";

import "./styles.css";

var cont_keys = 0;

export default class CreateEvent extends Component {
  constructor(props) {
    super(props);
    cont_keys = 0;
    this.state = {
      nameClass: this.props.nameClass,
      backHome: false,
      name: "",
      subjects: this.props.subjects,
      selectedSubject: "",
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
      info: "",
      infoWarning: "",
      infoWarning_: "",
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
        info: "Editar evento",
      });
    } else {
      this.setState({
        info: "Novo evento",
      });
    }
  };

  handleAddWord = (ev) => {
    ev.preventDefault();
    var el = document.getElementsByClassName("warningNotifyHour");
    var h = parseInt(this.state.notifyHour.substring(0, 2));
    var min = parseInt(this.state.notifyHour.substring(3, 5));
    if (this.state.word === "") {
      this.setState({ infoWarning: "*Informe uma palavra-passe" });
      el[0].style.display = "block";
    } else if (
      this.state.notifyHour === "" ||
      this.state.hourBegin === "" ||
      this.state.minutesBegin === "" ||
      this.state.hourEnd === "" ||
      this.state.minutesEnd === ""
    ) {
      this.setState({
        infoWarning: "*Informe a hora de início e término da aula",
      });
      el[0].style.display = "block";
    } else if (
      h > parseInt(this.state.hourEnd) ||
      h < parseInt(this.state.hourBegin) ||
      (h === parseInt(this.state.hourEnd) &&
        min >= parseInt(this.state.minutesEnd)) ||
      (h === parseInt(this.state.hourBegin) &&
        min <= parseInt(this.state.minutesBegin))
    ) {
      this.setState({
        infoWarning: "*Informe um horário entre o intervalo de aula",
      });
      el[0].style.display = "block";
    } else if (
      this.state.notifyHour === this.state.notifTime[0] ||
      this.state.notifyHour === this.state.notifTime[1] ||
      this.state.notifyHour === this.state.notifTime[2]
    ) {
      this.setState({ infoWarning: "*Informe um horário diferente" });
      el[0].style.display = "block";
    } else if (cont_keys === 3) {
      this.setState({
        infoWarning: "*É permitido adicionar apenas 3 palavras-passe",
      });
      el[0].style.display = "block";
    } else if (h > 24 || min >= 60) {
      this.setState({ infoWarning: "*Informe um horário válido" });
      el[0].style.display = "block";
    } else {
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

  handleChange = (ev) => {
    this.setState({ [ev.target.name]: ev.target.value });
  };

  verify = (ev) => {
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
      this.state.description === "" ||
      this.state.selectedSubject === ""
    ) {
      this.setState({ infoWarning_: "*Preencha todos os campos" });
      el[0].style.display = "block";
    } else if (
      parseInt(this.state.hourEnd) >= 24 ||
      parseInt(this.state.minuteEnd) >= 60 ||
      parseInt(this.state.hourBegin) >= 24 ||
      parseInt(this.state.minuteBegin) >= 60
    ) {
      this.setState({ infoWarning_: "*Informe horários válidos" });
      el[0].style.display = "block";
    } else if (d > 31 || m > 12 || y !== 20) {
      this.setState({ infoWarning_: "*Informe uma data válida" });
      el[0].style.display = "block";
    } else {
      el[0].style.display = "none";

      this.sendEvent();
    }
  };

  handleFixTime = (time) => {
    if (time[1] === "_") time = "0" + time[0];
    return time;
  };

  sendEvent = async () => {
    this.setState({
      hourBegin: await this.handleFixTime(this.state.hourBegin),
      hourEnd: await this.handleFixTime(this.state.hourEnd),
      minutesBegin: await this.handleFixTime(this.state.minutesBegin),
      minutesEnd: await this.handleFixTime(this.state.minutesEnd),
      loading: true,
    });
    await Event.createEvent(this.state).then(
      () => this.setState({ loading: false }),
      (error) => this.setState({ backHome: true })
    );
    localStorage.setItem("EventCreated", true);
    this.setState({ backHome: true });
  };

  handleEditEvent = async () => {
    this.setState({
      hourBegin: await this.handleFixTime(this.state.hourBegin),
      hourEnd: await this.handleFixTime(this.state.hourEnd),
      minutesBegin: await this.handleFixTime(this.state.minutesBegin),
      minutesEnd: await this.handleFixTime(this.state.minutesEnd),
      loading: true,
    });
    await Event.updateEvent(this.state).then(
      () => {},
      (error) => this.setState({ backHome: true })
    );
    localStorage.setItem("EventEdited", true);
    this.setState({ backHome: true });
  };

  render() {
    if (this.state.backHome) {
      return <Redirect to={{ pathname: "/" }} />;
    }
    return (
      <div className="newEventBody">
        <Loading loading={this.state.loading} />

        <div className="logoImage" style={{ padding: "10px 40px 0" }}>
          <img
            src={Logo}
            alt=""
            style={{
              height: "130px",
              width: "130px",
              padding: "2px",
              marginBottom: "20px",
            }}
          />
        </div>
        <div className="newEvent">
          <div className="title">
            <div className="title_">
              <h1>Título</h1>
              <input
                type="text"
                name="name"
                placeholder="Ex.: Ponto e Reta"
                onChange={this.handleChange}
                defaultValue={this.state.name}
              />
            </div>
            <div className="linkMeeting">
              <h1>Link do Meeting</h1>
              <input
                type="text"
                name="link"
                placeholder="Ex.: https://meet.google.com/ijm-vrdd-vjn"
                onChange={this.handleChange}
                defaultValue={this.state.link}
              />
            </div>
          </div>
          <div className="subject">
            <h1>Matéria</h1>
            <Select
              name="selectedSubject"
              value={this.state.selectedSubject}
              onChange={this.handleChange}
              subjects={this.state.subjects}
            />
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
              <h2 name="msgWarning">{this.state.infoWarning}</h2>
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
                <h2 key={index}>
                  {k}
                  {k !== "" ? ", " : null}
                  {this.state.notifTime[index]}
                </h2>
              ))}
            </div>
          </div>
          <div className="description">
            <h1>Descrição</h1>
            <textarea
              type="text"
              name="description"
              placeholder="Assunto abordado na aula"
              onChange={this.handleChange}
              defaultValue={this.state.description}
            />
          </div>
          <div className="warning">
            <h2 name="msgWarning">{this.state.infoWarning_}</h2>
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
            <div className="cancelButton">
              <button
                onClick={(ev) => {
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
