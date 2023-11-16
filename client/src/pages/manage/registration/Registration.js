import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { SideBar, NavBar } from "../../../components";
import {
  getAllRegistrations,
  deleteRegistration,
  getRegistrationID,
  addNewRegistration,
} from "../../../redux/apiRequest";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RegistrationDetails from "./RegistrationDetails";
import "./Registration.css";

const Registration = () => {
  const user = useSelector(state => state.auth.login?.currentUser);
  const listRegistrations = useSelector(state => state.registration.registrations.allRegistrations);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [address, setAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/Login");
    }
    if (user?.token) {
      const accessToken = user?.token;
      getAllRegistrations(accessToken, dispatch);
    }
  }, [dispatch, user?.token, navigate]);

  const handleDelete = id => {
    deleteRegistration(user?.token, dispatch, id);
  };

  const handleEditRegistration = regis => {
    const url = `/RegistrationDetails?id=${regis.id}`;
    navigate(url);
  };

  const handleOpenForm = () => {
    setOpenForm(true);
  };
  const handleEnterKeyPress = event => {
    if (event.key === "Enter") {
      handleAddNewRegistration();
    }
  };
  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleAddNewRegistration = () => {
    const data = {
      address,
    };

    if (user?.token) {
      addNewRegistration(user.token, dispatch, data)
        .then(() => {
          setOpenForm(false);
          navigate("/Registration");
        })
        .catch(error => {
          console.log(error);
          setErrorMessage(error.message);
        });
    }
  };

  return (
    <div className="Registration-container">
      <NavBar />
      <Box height={25} />

      <SideBar />
      <main className="home-container">
        <div className="home-title">Danh sách các hộ gia đình:</div>
        <div className="List_family">
          {listRegistrations?.map(regis => (
            <ul key={regis.id}>
              <li className="line-family">
                <div>{regis.address}</div>
                <div>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(regis.id)}>
                    <DeleteIcon />
                  </IconButton>
                </div>
                <div>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleEditRegistration(regis)}>
                    <EditIcon />
                  </IconButton>
                </div>
              </li>
            </ul>
          ))}
        </div>

        <Button variant="contained" style={styles.button} onClick={handleOpenForm}>
          Add New Registration
        </Button>
      </main>

      <Dialog open={openForm} onClose={handleCloseForm}>
        <DialogTitle>Create New Registration</DialogTitle>
        <DialogContent sx={{ width: "500px", height: "100px" }}>
          <TextField
            label="Address"
            fullWidth
            value={address}
            onChange={e => setAddress(e.target.value)}
            onKeyPress={handleEnterKeyPress} // Handle "Enter" key press
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>Cancel</Button>
          <Button onClick={handleAddNewRegistration} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const styles = {
  button: {
    marginTop: "20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Registration;
