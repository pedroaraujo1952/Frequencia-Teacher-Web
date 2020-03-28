import React, { Component } from "react";
import { fire } from "../../config/firebaseConfig";
import MaskedInput from 'react-text-mask';

import Header from "../../components/CreateEventHeader/Header";

import { Redirect } from 'react-router';

import "./styles.css";

var cont_keys;

export default class CreateEvent extends Component {

  constructor(props) {
    super(props);
    cont_keys = 0;
    this.state = {
      nameClass: this.props.nameClass,
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
      keyWord: ['','',''],
      key: '',
      info: ''
    };
  }

  componentWillMount = async () => {
    if(this.props.editEvent){
      this.setState({
        name: this.props.eventToEdit.name,
        date: this.props.eventToEdit.date,
        description: this.props.eventToEdit.description,
        key: this.props.eventToEdit.key,
        hourBegin: this.props.eventToEdit.timeBegin.substring(0,2),
        minutesBegin: this.props.eventToEdit.timeBegin.substring(3,5),
        hourEnd: this.props.eventToEdit.timeEnd.substring(0,2),
        minutesEnd: this.props.eventToEdit.timeEnd.substring(3,5),
        info: 'Editar evento'
      });
    } else {
      this.setState({
        info: 'Novo evento'
      });
    }
  }

  handleAddWord = ev => {
    ev.preventDefault();
    var el = document.getElementsByClassName('warningNotifyHour');
    var h = parseInt(this.state.notifyHour.substring(0,2));
    var min = parseInt(this.state.notifyHour.substring(3,5));
    if(
      this.state.word === '' ||
      this.state.notifyHour === '' ||
      this.state.hourBegin === '' ||
      this.state.minutesBegin === '' ||
      this.state.hourEnd === '' ||
      this.state.minutesEnd === ''
    ) {
      el[0].style.display = 'block';
    } else if (
      h > parseInt(this.state.hourEnd) ||
      h < parseInt(this.state.hourBegin) ||
      (h === parseInt(this.state.hourEnd) && min >= parseInt(this.state.minutesEnd)) ||
      (h === parseInt(this.state.hourBegin) && min <= parseInt(this.state.minutesBegin))
    ) {
      el[0].style.display = 'block';
    } else if(cont_keys !== 3) {
      el[0].style.display = 'none';
      var word = this.state.word + ', ' + this.state.notifyHour;
      const { keyWord } = this.state;
      keyWord[cont_keys++] = word; 
      this.setState({keyWord})
    }
  };

  handleChange = ev => {
    this.setState({ [ev.target.name]: ev.target.value });
  };

  verify = ev => {
    ev.preventDefault();
    var el = document.getElementsByClassName('warning');
    var d = parseInt(this.state.date.substring(0,2));
    var m = parseInt(this.state.date.substring(3,5));
    var y = parseInt(this.state.date.substring(6,8));
    if(
      this.state.name === '' ||
      this.state.hourBegin === '' ||
      this.state.minutesBegin === '' ||
      this.state.hourEnd === '' ||
      this.state.minutesEnd === '' ||
      this.state.date === '' ||
      this.state.keyWord === [] ||
      this.state.description === ''
    ) {
      el[0].style.display = 'block';
    } else if(
      parseInt(this.state.hourEnd) >= 24 ||
      parseInt(this.state.minuteEnd) >= 60 ||
      parseInt(this.state.hourBegin) >= 24 ||
      parseInt(this.state.minuteBegin) >= 60
    ) {
      el[0].style.display = 'block';
    } else if(
      d > 31 ||
      m > 12 ||
      y !== 20 
    ) {
      el[0].style.display = 'block';
    } else if(cont_keys === 0) {
      el[0].style.display = 'block';
    } else {
      el[0].style.display = 'none';
      this.sendEvent();
    } 
  }

  sendEvent = async () => {
    this.setState({backHome: true});
    var user = fire.auth().currentUser;
    var userId = user.uid;
    var data = {
      title: this.state.name,
      begin: this.state.hourBegin + 'h' + this.state.minutesBegin,
      date: this.state.date,
      description: this.state.description,
      end: this.state.hourEnd + 'h' + this.state.minutesEnd,
      keys: {'key1': this.state.keyWord[0], 'key2': this.state.keyWord[1], 'key3': this.state.keyWord[2]}
    };
    if(!this.props.editEvent){
      var eventKey = '';
      eventKey = (await fire.database().ref().child('professores/' + userId + '/events/' + this.state.nameClass).push(data)).key;
      this.loatStudents(eventKey, userId);
    } else{
      fire.database().ref().child('professores/' + userId + '/events/' + this.state.nameClass + '/' + this.state.key).set(data);
    }
  }

  loatStudents = async (eventKey, userId) => {
    var nameClass = this.state.nameClass;
    fire.database().ref('salas/' + this.state.nameClass).on('value', function(snapshot) {
      snapshot.forEach(async function(value) {
        var data = {
          checkin: "", 
          checkout: "", 
          keys: {key1: "", key2: "", key3: ""}, 
          name: value.val().name
        }
        await fire.database().ref().child('professores/' + userId + '/events/' + nameClass + '/' + eventKey + '/students').push(data);
      });
    });
  }

  render() {
    if(this.state.backHome) {
      return <Redirect to="/"/>
    }
    return (
        <div>
            <Header info={this.state.info}/>
            <div className="newEvent">
                <div className="title">
                    <h1>Título</h1>
                    <input type="text" name="name" value={this.state.name} onChange={this.handleChange}/>
                </div>
                <div className="timeBegin">
                    <h1>Horário de Início</h1>
                    <MaskedInput
                      name="hourBegin"
                      mask={[/[0-9]/,/\d/]}
                      value={this.state.hourBegin}
                      onChange={this.handleChange}
                    />
                    <h2 name="h">h</h2>
                    <MaskedInput
                      name="minutesBegin"
                      mask={[/[0-9]/,/\d/]}
                      value={this.state.minutesBegin}
                      onChange={this.handleChange}
                    />
                    <h2 name="min">min</h2>
                </div>
                <div className="timeEnd">
                    <h1>Horário de Término</h1>
                    <MaskedInput
                      name="hourEnd"
                      mask={[/[0-9]/,/\d/]}
                      value={this.state.hourEnd}
                      onChange={this.handleChange}
                    />
                    <h2 name="h">h</h2>
                    <MaskedInput
                      name="minutesEnd"
                      mask={[/[0-9]/,/\d/]}
                      value={this.state.minutesEnd}
                      onChange={this.handleChange}
                    />
                    <h2 name="min">min</h2>
                </div>
                <div className="date">
                    <h1>Data</h1>
                    {!this.props.editEvent ? <MaskedInput
                      name="date"
                      mask={[/[0-9]/,/\d/,'/',/\d/,/\d/,'/',/\d/,/\d/]}
                      onChange={this.handleChange}
                    /> : <input type="text" name="date" value={this.state.date} onChange={this.handleChange}/>}
                </div>
                <div className="keyWords">
                    <div className="warningNotifyHour">
                      <h2 name="msgWarning">*Informe um horário entre o intervalo da aula</h2>
                    </div>
                    <h1>Palavras-passe</h1>
                    <input type="text" name="word" placeholder="Palavra" onChange={this.handleChange}/>
                    <MaskedInput
                      name="notifyHour"
                      placeholder="Horário da notificação"
                      mask={[/[0-9]/,/\d/,'h',/\d/,/\d/,'min']}
                      onChange={this.handleChange}
                    />
                    <h2 name="button" onClick={this.handleAddWord}>+</h2>
                    <div className="words">
                        {this.state.keyWord.map((k,index) => (
                            <h2 key={index}>{k}</h2>
                        ))}
                    </div>
                </div>
                <div className="description">
                    <h1>Descrição</h1>
                    <input type="text" name="description" value={this.state.description} onChange={this.handleChange}/>
                </div>
                <div className="saveButton">
                    <button onClick={this.verify}>
                        <h2>Salvar</h2> 
                    </button>
                </div>
                <div className="warning">
                  <h2 name="msgWarning">*Preencha todos os campos corretamente</h2>
                </div>
                <div className="cancelButton">
                    <button onClick={ ev => {
                        ev.preventDefault();
                        this.setState({backHome: true});
                    }}>
                    <h2>Cancelar</h2> 
                    </button>
                </div>
            </div>
        </div>
    );
  }
}