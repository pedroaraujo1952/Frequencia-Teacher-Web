import React, { Component } from "react";
import { Redirect } from "react-router";

import { fire } from "../../config/firebaseConfig";
import Header from "../../components/HomeHeader/Header";
import Loading from "../../components/Loading/Loading";
import CreateEvent from "../CreateEvent/CreateEvent";

import * as Class from "../../controllers/ClassController";
import * as Event from "../../controllers/EventController";

import Avatar from "../../assets/profile-user.png";

import "./styles.css";

class Events {
  constructor(
    name_,
    date_,
    description_,
    timeBegin_,
    timeEnd_,
    keyWord_,
    students_,
    key_
  ) {
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

var new_event_class = "",
  editEvent = false,
  eventToEdit = new Events();

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
      new_event: false,
      reportState: null
    };
  }

  componentDidMount() {
    try {
      editEvent = false;
      this.loadClasses();
    } catch (e) {
      fire.auth().signOut();
      this.setState({ goLogin: true });
    }
  }

  loadClasses = async () => {
    this.setState({ loading: true });
    Class.loadClasses().then(
      classroom => {
        this.setState({ classes: classroom, loading: false });
      },
      error => {
        window.location.replace("/");
      }
    );
  };

  handleChange = ev => {
    this.setState({ [ev.target.name]: ev.target.value });
  };

  render() {
    if (this.state.goLogin) {
      return <Redirect to={{ pathname: "/" }} />;
    }

    if (this.state.reportState) {
      return (
        <Redirect to={{ pathname: "/report", state: this.state.reportState }} />
      );
    }
    return (
      <div>
        {this.state.new_event ? (
          <CreateEvent
            nameClass={new_event_class}
            editEvent={editEvent}
            eventToEdit={eventToEdit}
          />
        ) : (
          <div>
            {this.state.loading ? <Loading /> : null}
            <Header />
            <div className="homeFeed">
              {this.state.classes.map((c, index) => (
                <div className="rectanguleClass" key={index}>
                  <div className="nameClass">
                    <h1>{c.name}</h1>
                  </div>
                  <div className="events">
                    {c.events.map((e, ind) => (
                      <div className="rectanguleEvent" key={ind}>
                        <div className="nameEvent">
                          <h2>{e.title}</h2>
                        </div>
                        <div className="dateEvent">
                          <h2>{e.date}</h2>
                        </div>
                        <div className="line" />
                        <div className="descriptionEvent">
                          <h2>Descrição: {e.description}</h2>
                        </div>
                        <div className="timeBeginEvent">
                          <h2>Início: {e.begin}</h2>
                        </div>
                        <div className="timeEndEvent">
                          <h2>Fim: {e.end}</h2>
                        </div>
                        <div className="keyWordEvent">
                          <h2>
                            Palavra-passe: {e.keys["key1"].key},{" "}
                            {e.keys["key2"].key}, {e.keys["key3"].key}
                          </h2>
                        </div>
                        <div className="editEvent">
                          <button
                            onClick={ev => {
                              ev.preventDefault();
                              this.setState({ new_event: true });
                              new_event_class = c.name;
                              editEvent = true;
                              eventToEdit = e;
                            }}
                          >
                            <h1>Editar evento</h1>
                          </button>
                        </div>
                        <div className="deleteEvent">
                          <button
                            onClick={async ev => {
                              ev.preventDefault();

                              await Event.deleteEvent(e, c.name).then(() => {
                                const { classes } = this.state;
                                classes[index].events.splice(ind, 1);
                                this.setState({ classes });
                              });
                            }}
                          >
                            <h1>Excluir evento</h1>
                          </button>
                        </div>
                        <div className="frequenceEvent">
                          <button
                            onClick={ev => {
                              ev.preventDefault();

                              const reportState = {
                                classroom: c.name,
                                id: e.id
                              };

                              this.setState({ reportState });
                            }}
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
                        new_event_class = c.name;
                        this.setState({ new_event: true });
                      }}
                    >
                      <h1>+ Criar evento</h1>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
}
