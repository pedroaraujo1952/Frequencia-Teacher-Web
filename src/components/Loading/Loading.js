import React from "react";
import Loader from "react-loader-spinner";

import "./styles.css";

const style = {
  width: "10%",
  height: "10%",
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)"
};

const Loading = () => (
  <div className="loading">
    <div style={style}>
      <Loader type="Oval" color="#043f5f" height={80} width={80} />
    </div>
  </div>
);

export default Loading;
