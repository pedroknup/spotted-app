import React from "react";
import "./input.component.css";

const InputComponent = props => {
  const onChange = event => {
    if (props.onChange) {
      props.onChange(event.target.value);
    }
  };
  return (
    <div style={{ width: "100%" }}>
      <input
        className="input"
        placeholder={props.placeholder}
        onChange={onChange}
      ></input>
    </div>
  );
};

export default InputComponent;
