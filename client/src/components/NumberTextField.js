import React from "react";
import TextField from "@mui/material/TextField";

const NumberTextField = ({ label, onChange, required, ...props }) => {
  const handleInputChange = event => {
    const inputValue = event.target.value.replace(/[^0-9]/g, "");
    event.target.value = inputValue;

    if (onChange) {
      onChange(inputValue);
    }
  };

  return (
    <TextField
      label={label}
      onChange={handleInputChange}
      inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
      required={required !== undefined ? required : true}
      {...props}
    />
  );
};

export default NumberTextField;
