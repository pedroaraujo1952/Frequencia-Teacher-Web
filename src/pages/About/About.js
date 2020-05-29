import React from "react";

import Header from "../../components/AboutHeader/AboutHeader";

import "./styles.css";

const About = () => (
  <div className="aboutUs">
    <Header info="Sobre nós" />
    <div className="body">
      <div className="allGroups">
        <div className="gerente">
          <h2>Gerente de Projeto</h2>
          <p>Klinsman Maia</p>
        </div>

        <div className="designers">
          <h2>Designers</h2>
          <p>Débora Colhyer</p>
          <p>Isabella Melo</p>
        </div>
      </div>
      <div>
        <div className="devs">
          <h2>Desenvolvedores</h2>
          <p>Arley Novais</p>
          <p>Ian Marcony</p>
          <p>José Leão</p>
          <p>Kirk Sahdo</p>
          <p>Lorenzo Windmöller</p>
          <p>Pedro Araújo</p>
        </div>
      </div>
    </div>
  </div>
);

export default About;
