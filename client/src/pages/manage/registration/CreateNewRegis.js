import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { addNewRegistration } from "../../../redux/apiRequest";
import { NavBar } from "../../../components";

const CreateNewRegis = () => {
  const user = useSelector(state => state.auth.login?.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const [identityCardNumber, setIdentityCardNumber] = useState("");
  const [address, setAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  // const handleIdentityCardChange = e => {
  //   setIdentityCardNumber(e.target.value);
  // };

  const handleAddressChange = e => {
    setAddress(e.target.value);
  };

  const handleAddNewRegistration = () => {
    // Check if the user and token exist
    const data = {
      // identityCardNumber,
      address,
    };

    if (user?.token) {
      addNewRegistration(user.token, dispatch, data)
        .then(() => {
          // Handle success, navigate, or reset form fields
          navigate("/Registration");
        })
        .catch(error => {
          // Handle errors and set the error message
          setErrorMessage(error.message);
        });
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Create New Registration</h2>
      <form onSubmit={e => e.preventDefault()}>
        <div style={styles.formGroup}>
          {/* <label htmlFor="identityCardNumber" style={styles.label}>
            Citizen Identity Card Number:
          </label>
          <input
            type="text"
            id="identityCardNumber"
            value={identityCardNumber}
            onChange={handleIdentityCardChange}
            style={styles.input}
          /> */}
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="address" style={styles.label}>
            Address:
          </label>
          <input type="text" id="address" value={address} onChange={handleAddressChange} style={styles.input} />
        </div>
        <button type="submit" style={styles.submitButton} onClick={handleAddNewRegistration}>
          Submit
        </button>
      </form>
      <Link to="/Registration" style={styles.link}>
        <Button variant="contained" style={styles.button}>
          Trở về
        </Button>
      </Link>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  title: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  formGroup: {
    marginBottom: "10px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold",
  },
  input: {
    width: "90%",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  submitButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  link: {
    textDecoration: "none",
  },
  button: {
    marginLeft: "500px",
    backgroundColor: "#ff5733",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default CreateNewRegis;
