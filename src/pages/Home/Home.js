import * as React from "react";
import { Redirect } from "react-router";

import { fire } from "../../config/firebaseConfig";
import Header from "../../components/HomeHeader/HomeHeader";
import Loading from "../../components/Loading/Loading";
import CreateEvent from "../CreateEvent/CreateEvent";

import { toast } from "react-toastify";

import * as Class from "../../controllers/ClassroomsController";
import * as Event from "../../controllers/EventsController";
import * as User from "../../controllers/UsersController";

import MultipleSelect from "../../components/MultipleSelect/MultipleSelect";
import Dialog from "../../components/Dialog/Dialog";
import MaskedInput from "react-text-mask";

import Avatar from "../../assets/profile-user.png";

import "./styles.css";
import "react-toastify/dist/ReactToastify.css";

class Events {
  constructor(
    name_,
    date_,
    description_,
    timeBegin_,
    timeEnd_,
    keyWord_,
    key_
  ) {
    this.name = name_;
    this.date = date_;
    this.description = description_;
    this.timeBegin = timeBegin_;
    this.timeEnd = timeEnd_;
    this.keyWord = keyWord_;
    this.key = key_;
  }
}

var new_event_class = "",
  editEvent = false,
  eventToEdit = new Events();

toast.configure();

export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      goLogin: false,
      username: "",
      subjects: [],
      avatar: Avatar,
      avatarURL: null,
      classroom: [],

      edit: false,
      date: "",

      email: "",
      emailError: "",
      pswd: "",
      pswdError: "",

      loading: false,
      classes: [],
      new_event: false,
      reportState: null,

      checkSearch: false,
      showResult: false,
      checkDeleteEvent: [false, null, -1, -1],
    };
  }

  componentDidMount() {
    try {
      editEvent = false;
      this.loadSubject();
    } catch (e) {
      fire.auth().signOut();
      this.setState({ goLogin: true });
    }
  }

  searchClassroomEvents = async () => {
    await this.setState({ loading: true, classes: [], showResult: true });

    await Class.loadClassroomEvents(this.state).then((classes) => {
      this.setState({ classes, loading: false, checkSearch: true, showResult: false });
    });
  }

  loadSubject = async () => {
    this.setState({ loading: true });
    User.getSubject().then(
      (subjects) => {
        this.setState({subjects, loading: false});
      },
      (error) => {
        window.location.replace("/");
      }
    );
  };

  handleChange = (ev) => {
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
            subjects={this.state.subjects}
            editEvent={editEvent}
            eventToEdit={eventToEdit}
          />
        ) : (
          <div>
            <Loading loading={this.state.loading} />
            <Header />
            <div className="homeFeed">
              {localStorage.getItem("EventCreated")
                ? toast.success("Evento criado com sucesso", {
                    autoClose: 3500,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                  }) | localStorage.removeItem("EventCreated")
                : null}
              {localStorage.getItem("EventEdited")
                ? toast.info("Evento editado com sucesso", {
                    autoClose: 3500,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                  }) | localStorage.removeItem("EventEdited")
                : null}
              <div className="classroom-filter">
                <div className="createEvent">
                    <button
                      onClick={(ev) => {
                        ev.preventDefault();
                        this.setState({ new_event: true });
                      }}
                    >
                      <h1>+ Criar evento</h1>
                    </button>
                </div>
                <div className="filter-inputs">
                  <h1>Consulta de eventos</h1>
                  <h2>Selecione a(s) turma(s)</h2>
                  <MultipleSelect
                    name="classroom"
                    onChange={this.handleChange}
                    onMultipleChange={this.handleMultipleChange}
                    value={this.state.classroom}
                  />
                  <h2>Selecione a data</h2>     
                  <MaskedInput
                    name="date"
                    mask={[/[0-9]/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/]}
                    onChange={this.handleChange}
                    defaultValue={this.state.date}
                  />
                  <button onClick={async (ev) => {
                    ev.preventDefault();
                    
                    if (this.state.classroom !== [] && this.state.date !== "") {
                      await this.searchClassroomEvents();
                    }
                  }}>
                    <h1>Buscar</h1>
                  </button>
                </div>
              </div>

              <Dialog
                open={this.state.checkSearch}
                onClose={() => {
                  this.setState({ checkSearch: false, classes: [] })
                }}
                onChange={this.handleChange}
                onClickCancel={(ev) => {
                  ev.preventDefault();
                  this.setState({ checkSearch: false, classes: [] })
                }}
                onClickOk={(ev) => {
                  ev.preventDefault();
                  this.setState({ checkSearch: false, showResult: true })
                }}
                message="Deseja realizar essa consulta?"
              />

              <Dialog
                open={this.state.checkDeleteEvent[0]}
                onClose={() => {
                  this.setState({ checkDeleteEvent: [false, null, -1, -1] })
                }}
                onChange={this.handleChange}
                onClickCancel={(ev) => {
                  ev.preventDefault();
                  this.setState({ checkDeleteEvent: [false, null, -1, -1] })
                }}
                onClickOk={async (ev) => {
                  ev.preventDefault();

                  await Event.deleteEvent(this.state.checkDeleteEvent[1], 
                    this.state.checkDeleteEvent[1].classroom).then(() => {
                    var { classes } = this.state;

                    if (classes[this.state.checkDeleteEvent[2]].events.length === 1) {                      
                      classes[this.state.checkDeleteEvent[2]].events
                        .splice(this.state.checkDeleteEvent[3], 1);
                        
                      delete classes[this.state.checkDeleteEvent[2]];
                    } else {                      
                      classes[this.state.checkDeleteEvent[2]].events
                        .splice(this.state.checkDeleteEvent[3], 1);
                    }
                    
                    this.setState({ classes, checkDeleteEvent: [false, null, -1, -1] });
                    
                    toast.error("Evento deletado com sucesso", {
                      autoClose: 3500,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                    });
                  });
                  
                }}
                message="Deseja excluir esse evento?"
              />

              {this.state.showResult ? 
                this.state.classes.map((c, index) => (
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
                            <h2>Palavra-passe: {e.formatedKeys}</h2>
                          </div>
                          <div className="editEvent">
                            <button
                              onClick={(ev) => {
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
                              onClick={async (ev) => {
                                ev.preventDefault();
                                this.setState({ checkDeleteEvent: [true, e, index, ind] });
                              }}
                            >
                              <h1>Excluir evento</h1>
                            </button>
                          </div>
                          <div className="frequenceEvent">
                            <button
                              onClick={(ev) => {
                                ev.preventDefault();

                                const reportState = {
                                  event: e,
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
                  </div>
                ))
              : null}
            </div>
          </div>
        )}
      </div>
    );
  }
}
