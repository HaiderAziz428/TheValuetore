import React from "react";
import s from "./Loader.module.scss";

const Loader = ({ size = "medium", text = "Loading..." }) => {
  return (
    <div className={s.loaderContainer}>
      <div className={`${s.spinner} ${s[size]}`}></div>
      {text && <p className={s.loadingText}>{text}</p>}
    </div>
  );
};

export default Loader;
