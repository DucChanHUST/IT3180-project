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
  updateRegistration,
} from "../../../redux/apiRequest";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import "./Registration.css";
import Resident from "./../resident/Resident";

const Registration = () => {
  const user = useSelector(state => state.auth.login?.currentUser);
  const listRegistrations = useSelector(state => state.registration.registrations.allRegistrations);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openForm, setOpenForm] = useState(false);
  const [address, setAddress] = useState("");
  const [resetPage, setResetPage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [editAddress, setEditAddress] = useState("");
  const [selectedRegistrationId, setSelectedRegistrationId] = useState(null);
  const [listRegistrationsID, setListRegistrationsID] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        navigate("/Login");
        return;
      }

      if (user?.token) {
        const accessToken = user?.token;
        getAllRegistrations(accessToken, dispatch);
      }

      if (resetPage) {
        navigate("/Registration");
        setResetPage(false);
      }

      try {
        const id = user.id;
        const accessToken = user.token;
        const res = await getRegistrationID(accessToken, dispatch, id);
        setListRegistrationsID(res);
      } catch (error) {
        console.error(error);
        // Xử lý lỗi ở đây nếu cần thiết
      }
    };

    fetchData();
  }, [dispatch, user, resetPage, navigate]);

  const handleDelete = id => {
    deleteRegistration(user?.token, dispatch, id);
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

  const handleEnterEditKeyPress = event => {
    if (event.key === "Enter") {
      handleUpdateRegistration();
    }
  };

  const handleAddNewRegistration = () => {
    const data = {
      address,
    };

    if (user?.token) {
      addNewRegistration(user.token, dispatch, data)
        .then(() => {
          setAddress(""); // Reset address field
          setErrorMessage(null); // Clear error message
          setOpenForm(false);
          setResetPage(true);
        })
        .catch(error => {
          console.log(error);
          setErrorMessage(error.message);
        });
    }
  };

  const handleEditRegistration = regis => {
    setSelectedRegistrationId(regis.id);
    setEditAddress(regis.address);
    setEditFormOpen(true);
  };

  const handleEditFormClose = () => {
    setEditFormOpen(false);
    setEditAddress("");
    setSelectedRegistrationId(null);
  };

  const handleUpdateRegistration = () => {
    const data = {
      address: editAddress,
    };

    if (user?.token) {
      updateRegistration(user.token, dispatch, data, selectedRegistrationId)
        .then(() => {
          setEditFormOpen(false);
          setResetPage(true);
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
      <Box height={64} />

      <SideBar />
      <main className="home-container">
        <div>
          {user?.userRole === "resident" ? (
            <div>
              {Array.isArray(listRegistrationsID) && listRegistrationsID.length > 0 ? (
                listRegistrations.map(regis => (
                  <ul key={regis.id}>
                    <li className="line-family">
                      <div>{regis.address}</div>
                    </li>
                  </ul>
                ))
              ) : (
                <p>No registrations found.</p>
              )}
            </div>
          ) : user?.userRole === "accountant" ? (
            <div>2</div> // Hiển thị nội dung khi vai trò là "accountant"
          ) : user?.userRole === "leader" ? (
            <div>
              <div className="home-title">Danh sách các hộ gia đình:</div>
              <div className="List_family">
                {Array.isArray(listRegistrations) && listRegistrations.length > 0 ? (
                  listRegistrations.map(regis => (
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
                  ))
                ) : (
                  <p>No registrations found.</p>
                )}
              </div>
              <Button variant="contained" style={styles.button} onClick={handleOpenForm}>
                Add New Registration
              </Button>
            </div>
          ) : (
            <div>Vai trò không xác định</div> // Hiển thị thông báo khi vai trò không khớp
          )}
        </div>
      </main>
      <Dialog open={openForm} onClose={handleCloseForm}>
        <DialogTitle>Create New Registration</DialogTitle>
        <DialogContent sx={{ width: "500px", height: "100px" }}>
          <TextField
            sx={{ marginTop: "10px" }}
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
      {/* Edit Registration Dialog */}
      <Dialog open={editFormOpen} onClose={handleEditFormClose}>
        <DialogTitle>Edit Registration</DialogTitle>
        <DialogContent sx={{ width: "500px", height: "100px" }}>
          <TextField
            sx={{ marginTop: "10px" }}
            label={editAddress}
            fullWidth
            value={editAddress}
            onChange={e => setEditAddress(e.target.value)}
            onKeyPress={handleEnterEditKeyPress}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditFormClose}>Cancel</Button>
          <Button onClick={handleUpdateRegistration} color="primary">
            Update
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

  DialogTitle: {
    fontSize: "10px",
  },
};

export default Registration;
