import React from "react";
import TextField from "@mui/material/TextField";

const TextOnlyTextField = ({ label, onChange, required, ...props }) => {
  const handleInputChange = event => {
    const inputValue = event.target.value.replace(vietnameseAlphabetRegex, "");
    event.target.value = inputValue;

    if (onChange) {
      onChange(inputValue);
    }
  };

  return (
    <TextField
      label={label}
      onChange={handleInputChange}
      inputProps={{
        inputMode: "text",
        pattern: vietnameseAlphabetRegex,
      }}
      required={required !== undefined ? required : true}
      {...props}
    />
  );
};

const vietnameseAlphabetRegex =
  /[^aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆ fFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTu UùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ]/g;
export default TextOnlyTextField;
