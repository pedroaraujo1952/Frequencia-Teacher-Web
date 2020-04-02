import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import * as User from "../../controllers/UserController";

import Loading from "../../components/Loading/Loading";

import Logo from "../../assets/Logok.png";
import Back from "../../assets/back.png";

import "./styles.css";

import { makeStyles, withStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import NativeSelect from "@material-ui/core/NativeSelect";
import InputBase from "@material-ui/core/InputBase";

export default class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      subject: "",
      email: "",
      emailError: "",
      pswd: "",
      pswdError: "",
      pswdConfirm: "",
      pswdConfirmError: "",

      stats: false
    };
  }

  handleChange = ev => {
    this.setState({ [ev.target.name]: ev.target.value });
  };

  handleSignup = async ev => {
    ev.preventDefault();

    this.setState({ loading: true });

    await User.createUser(this.state).then(
      stats => this.setState({ stats, loading: !stats }),
      error => {
        if (error.type === "EMAIL_ERROR")
          this.setState({
            loading: false,
            emailError: error.message,
            pswdError: "",
            pswdConfirmError: ""
          });
        else if (error.type === "PSWD_ERROR")
          this.setState({
            loading: false,
            pswdError: error.message,
            pswdConfirmError: error.message,
            emailError: ""
          });
        else {
          this.setState({
            loading: false,
            pswdError: "",
            emailError: "",
            pswdConfirmError: ""
          });
          alert(error.message);
        }
      }
    );
  };

  render() {
    const BootstrapInput = withStyles(theme => ({
      root: {
        "label + &": {
          marginTop: theme.spacing(3)
        }
      },
      input: {
        borderRadius: 8,
        position: "relative",
        backgroundColor: theme.palette.background.paper,
        border: "1px solid #ced4da",
        fontSize: 22,
        padding: "10px 26px 10px 20px",
        transition: theme.transitions.create(["border-color", "box-shadow"]),
        // Use the system font instead of the default Roboto font.
        fontFamily: ['"Segoe UI"'].join(","),
        "&:focus": {
          borderRadius: 8,
          borderColor: "#80bdff",
          boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)"
        }
      }
    }))(InputBase);

    if (this.state.stats) {
      return <Redirect to="/" />;
    }

    return (
      <div className="register">
        {this.state.loading ? <Loading /> : null}

        <header>
          <div className="backImage" style={{ margin: 0, padding: "3%" }}>
            <img
              src={Back}
              alt="voltar"
              style={{
                border: "3px solid #043f5f",
                borderRadius: "100%",
                padding: "2px",
                maxHeight: "100px",
                minHeight: "100px",
                maxWidth: "100px",
                minWidth: "100px"
              }}
              onClick={() =>
                this.setState({
                  stats: true,
                  name: "",
                  subject: "",
                  pswd: "",
                  pswdError: "",
                  pswdConfirm: "",
                  pswdConfirmError: "",
                  email: "",
                  emailError: ""
                })
              }
            />
          </div>
        </header>

        <form className="registerForm">
          <div className="logo">
            <img src={Logo} alt="" />
            <h1>CADASTRO</h1>
          </div>
          <p>Nome</p>
          <input type="text" name="name" onChange={this.handleChange} />

          <p>Materia</p>
          <FormControl>
            <Select
              labelId="demo-customized-select-label"
              id="demo-customized-select"
              name="subject"
              value={this.state.subject}
              onChange={this.handleChange}
              input={<BootstrapInput />}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={"API"}>API</MenuItem>
              <MenuItem value={"Arte"}>Arte</MenuItem>
              <MenuItem value={"Biologia"}>Biologia</MenuItem>
              <MenuItem value={"Ed. Física"}>Ed. Física</MenuItem>
              <MenuItem value={"Filosofia"}>Filosofia</MenuItem>
              <MenuItem value={"Física"}>Física</MenuItem>
              <MenuItem value={"Geografia"}>Geografia</MenuItem>
              <MenuItem value={"História"}>História</MenuItem>
              <MenuItem value={"L. Inglesa"}>L. Inglesa</MenuItem>
              <MenuItem value={"L. Portuguesa"}>L. Portuguesa</MenuItem>
              <MenuItem value={"LPIII/WEB"}>LPIII/WEB</MenuItem>
              <MenuItem value={"Matemática"}>Matemática</MenuItem>
              <MenuItem value={"Mobile"}>Mobile</MenuItem>
              <MenuItem value={"Química"}>Química</MenuItem>
              <MenuItem value={"Sociologia"}>Sociologia</MenuItem>
            </Select>
          </FormControl>

          <p>Email</p>
          <input type="email" name="email" onChange={this.handleChange} />
          <p className="error">{this.state.emailError}</p>

          <p>Senha</p>
          <input type="password" name="pswd" onChange={this.handleChange} />
          <p className="error">{this.state.pswdError}</p>

          <p>Confirmar Senha</p>
          <input
            type="password"
            name="pswdConfirm"
            onChange={this.handleChange}
          />
          <p className="error">{this.state.pswdError}</p>

          <button onClick={this.handleSignup} style={{ fontSize: "14px" }}>
            CADASTRAR
          </button>
        </form>
      </div>
    );
  }
}
