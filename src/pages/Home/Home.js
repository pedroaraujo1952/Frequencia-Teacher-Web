import React, { Component } from "react";

import Header from "../../components/HomeHeader/Header";
import Loading from "../../components/Loading/Loading";

import Avatar from "../../assets/profile-user.png";

import { Redirect } from 'react-router';

import "./styles.css";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      avatar: Avatar,
      avatarURL: null,

      edit: false,

      email: "",
      emailError: "",
      pswd: "",
      pswdError: "",

      loading: false,
      classes: this.props.classes,
      new_event: false
    };
  }

  handleChange = ev => {
    this.setState({ [ev.target.name]: ev.target.value });
  };

  render() {
    if(this.state.new_event) {
      return <Redirect to="/create_event"/>
    }
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
                        onClick={ev => {
                          ev.preventDefault();
                          this.setState({new_event: true});
                        }}
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