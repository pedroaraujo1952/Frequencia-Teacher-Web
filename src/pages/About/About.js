import React from "react";

import Header from "../../components/AboutHeader/Header";

import "./styles.css";

const About = () => (
  <div className="aboutUs">
    <Header info="Sobre nós" />
    <div className="body">
      <div>
        <div className="devs" style={{ width: "400px" }}>
          <h2>Desenvolvedores</h2>
          <p>Arley Novais</p>
          <p>Ian Marcony</p>
          <p>José Leão</p>
          <p>Pedro Araújo</p>
          <p>Lorenzo Windmöller</p>
          <p>Kirk Sahdo</p>
        </div>
      </div>

      <div style={{ width: "400px" }}>
        <div className="designers">
          <h2>Designers</h2>
          <p>Débora Colhyer</p>
          <p>Isabella Melo</p>
        </div>

        <div className="gerente" style={{ width: "400px" }}>
          <h2>Gerente de Projeto</h2>
          <p>Klinsman Maia</p>
        </div>
      </div>
    </div>
  </div>
);

export default About;
