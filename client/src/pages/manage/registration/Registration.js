import React, { useEffect, useState } from "react";
import { Box, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { SideBar, NavBar } from "../../../components";
import {
  getAllRegistrations,
  deleteRegistration,
  getRegistrationID,
  addNewRegistration,
  updateRegistration,
} from "../../../redux/apiRequest";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import "./Registration.css";

const Registration = () => {
  const user = useSelector(state => state.auth.login?.currentUser);
  const listRegistrations = useSelector(state => state.registration.registrations.allRegistrations);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openForm, setOpenForm] = useState(false);
  const [address, setAddress] = useState("");
  const [resetPage, setResetPage] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [editAddress, setEditAddress] = useState("");
  const [selectedRegistrationId, setSelectedRegistrationId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) {
          navigate("/Login");
          return;
        }

        if (user?.token && (user.userRole === "leader" || user.userRole === "accountant")) {
          const accessToken = user.token;
          // Fetch all registrations or perform any necessary action with the token
          getAllRegistrations(accessToken, dispatch);
        }
        if (user?.token && user.userRole === "resident") {
          const accessToken = user.token;
          const id = user.userId;
          console.log("user", user);
          // setRegistrationID = await getRegistrationID(accessToken, dispatch, id);
          getRegistrationID(accessToken, dispatch, id);
        }

        if (resetPage) {
          navigate("/Registration");
          setResetPage(false);
        }
      } catch (error) {
        console.error(error);
        // Handle errors here
      }
    };

    fetchData();
  }, [dispatch, user, resetPage, navigate]);

  const handleDelete = id => {
    if (user.userRole === "leader") {
      deleteRegistration(user?.token, dispatch, id);
    } else alert("You don't have permission");
  };

  const handleOpenAddForm = () => {
    if (user.userRole === "leader") {
      setOpenForm(true);
    } else alert("You don't have permission");
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
    let addressExists = false;

    // Check if the address already exists in listRegistrations
    listRegistrations.forEach(regis => {
      if (regis.address === address) {
        addressExists = true;
        alert("This address already exists, please check your address again");
      }
    });

    if (!addressExists) {
      const data = {
        address,
      };

      if (user?.token) {
        addNewRegistration(user.token, dispatch, data)
          .then(() => {
            setAddress(""); // Reset address field
            setOpenForm(false);
            alert("Add new registration successfully");
            setResetPage(true);
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  };

  const handleEditRegistration = regis => {
    if (user.userRole === "leader") {
      listRegistrations.forEach(registration => {
        if (registration.address === editAddress) {
          alert("This address has already existed, please check your address again");
        }
        setEditFormOpen(true);
      });
      setSelectedRegistrationId(regis.id);
      setEditAddress(regis.address);
      setEditFormOpen(true);
    } else {
      alert("You haven't permission");
    }
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
          <div className="home-title">Danh sách các hộ gia đình:</div>
          <div className="List_family">
            {Array.isArray(listRegistrations) && listRegistrations.length > 0 ? (
              <table className="table-content">
                <thead className="header-table">
                  <tr>
                    <th>ID</th>
                    <th className="address-cell">Địa chỉ</th>
                    <th className="thaotac">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {listRegistrations.map(regis => (
                    <tr key={regis.id}>
                      <td className="id">{regis.id}</td>
                      <td className="address-cell">{regis.address}</td>
                      <td className="align-right">
                        <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(regis.id)}>
                          <DeleteIcon />
                        </IconButton>
                        <IconButton edge="end" aria-label="edit" onClick={() => handleEditRegistration(regis)}>
                          <EditIcon />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No registrations found.</p>
            )}
          </div>

          <Button variant="contained" style={styles.button} onClick={handleOpenAddForm}>
            Add New Registration
          </Button>
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
            label="Address"
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
