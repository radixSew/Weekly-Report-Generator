import React from "react";
import "../../styles/components/Loading.css";

function Loading({ message = "Loading..." }) {
  return (
    <div className="common-loading">
      <div className="loading-spinner"></div>
      <p>{message}</p>
    </div>
  );
}

export default Loading;