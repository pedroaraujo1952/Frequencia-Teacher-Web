import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import { database } from "../../config/firebaseConfig";
import * as User from "../../controllers/UserController";

import { isLogged } from "../../services/auth";
import * as Students from "../../controllers/StudentsController";

import Logo from "../../assets/Logok.png";
import Back from "../../assets/back.png";

import "./styles.css";

export default class Report extends Component {
  constructor(props) {
    super(props);
    this.state = {
      students: [],
      event: {},

      goHome: false
    };
  }

  componentDidMount() {
    isLogged();
    this.getData("3AI", "evento1");
  }

  getEvents = async () => {};

  getData = async (classroom, eventName) => {
    var user = await User.getUser();

    var eventRef = database.ref(
      `professores/${user.uid}/events/${classroom}/${eventName}`
    );

    await eventRef.on("value", snap => {
      var students = [];
      var event = {};
      event = snap.val();

      snap.child("students").forEach(element => {
        const studentObject = element.val();
        const student = {
          name: studentObject["name"],
          checkin: studentObject["checkin"],
          checkout: studentObject["checkout"],
          key: Students.validateKey(element.child("keys")),
          checkinStatus: Students.validateTime(
            event["begin"],
            studentObject["checkin"]
          )
        };
        students.push(student);
      });

      this.setState({ students, event });
    });
  };

  handleAbsent = async () => {
    await this.getData("3AI", "evento1");
    const { students } = this.state;
    var newStudents = [];

    students.forEach(element => {
      if (element.checkin === "Ausente" && element.checkout === "Ausente") {
        newStudents.push(element);
      }
    });

    this.setState({ students: newStudents });
  };

  handleLate = async () => {
    await this.getData("3AI", "evento1");
    const { students } = this.state;
    var newStudents = [];

    students.forEach(element => {
      if (element.checkinStatus === false) {
        newStudents.push(element);
      }
    });

    this.setState({ students: newStudents });
  };

  handleFilterChange = ev => {
    const value = ev.target.value;

    if (value === "absent") {
      this.handleAbsent();
    } else if (value === "late") {
      this.handleLate();
    } else {
      this.getData("3AI", "evento1");
    }
  };

  handleBack = ev => {
    ev.preventDefault();
    this.setState({ goHome: true });
  };

  render() {
    if (this.state.goHome) {
      return <Redirect to="/" />;
    }

    return (
      <div className="report">
        <header>
          <div className="backImage" style={{ marginTop: "0 " }}>
            <img
              src={Back}
              alt="voltar"
              style={{
                border: "3px solid #043f5f",
                borderRadius: "100%",
                maxHeight: "80px",
                maxWidth: "80px",
                minWidth: "80px",
                minHeight: "80px",
                marginRight: "10px",
                padding: "2px",
                paddingTop: "0"
              }}
              onClick={this.handleBack}
            />
          </div>
          <img src={Logo} alt="" /> <h1>Frequência</h1>
        </header>
        <div className="filter">
          <select
            name="filter"
            defaultValue="default"
            onChange={this.handleFilterChange}
          >
            <option value="default" default>
              Filtrar por
            </option>
            <option value="late">Atrasados</option>
            <option value="absent">Ausentes</option>
          </select>
        </div>
        <div className="tableHeader">
          <h2>Aluno</h2>
          <div>
            <h2 id="first">Check-in</h2>
            <h2 id="second">Check-out</h2>
            <h2 id="third">Palavra-passe</h2>
          </div>
        </div>
        <div className="table">
          <hr className="vr" />
          <table>
            <tbody>
              {Array.isArray(this.state.students) && this.state.students.length
                ? this.state.students.map((student, index) => (
                    <tr key={index}>
                      <td>{student["name"]}</td>
                      {student["checkinStatus"] ? (
                        <td id="second-child" style={{ textAlign: "center" }}>
                          {student["checkin"]}
                        </td>
                      ) : (
                        <td
                          id="second-child"
                          style={{ color: "#ff0000", textAlign: "center" }}
                        >
                          {student["checkin"]}
                        </td>
                      )}
                      {student["checkin"] !== "Ausente" ? (
                        <td style={{ textAlign: "center" }}>
                          {student["checkout"]}
                        </td>
                      ) : (
                        <td style={{ color: "#ff0000", textAlign: "center" }}>
                          {student["checkout"]}
                        </td>
                      )}
                      {student["key"] !== 0 ? (
                        <td>{student["key"]}/3</td>
                      ) : (
                        <td style={{ color: "#ff0000" }}>{student["key"]}/3</td>
                      )}
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
