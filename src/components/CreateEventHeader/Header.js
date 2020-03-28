import React, { Component } from "react";

import Logo from "../../assets/Logok.png";

import "./styles.css";

export default class Header extends Component {

  constructor(props){
    super(props);
    this.state = {
      text: ''
    }
  }

  componentWillMount = () => {
    console.log(this.props)
    this.setState({
      text: this.props.info
    })
  } 

  render() {
    return(
        <div className="header">
          
          <div className="logoImage">
            <img 
              src={Logo} 
              alt=""
              style={{
                height: "130px",
                width: "130px",
                padding: "2px"
              }} 
            />
          </div>
          
            <div className="textoLogo"><h1>{this.state.text}</h1></div>
        
        </div>
    );
  }    
} 