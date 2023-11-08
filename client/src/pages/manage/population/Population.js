import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { SideBar, NavBar } from "../../../components";
import "./population.css";
import { deleteUser, getAllUsers } from "../../../redux/apiRequest";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


const Population = () => {
  const user = useSelector(state => state.auth.login?.currentUser);
  const listPeople = useSelector((state) => state.users.users?.allUsers);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  useEffect(() => {
    if (!user) {
      navigate("/Login");
    }
    if (user?.token) {
      const accessToken = user?.token; // Replace with your actual access token
      getAllUsers(accessToken, dispatch);
    }
  }, []); // Include 'dispatch' and 'user.token' in the dependency array

  const handleDelete = (id) => {
    deleteUser(user?.token, dispatch, id);
  }
  return (
    <>
      <NavBar />
      <Box height={25} />
      <Box sx={{ display: "flex" }}>
        <SideBar />
        <main className="home-container">
          <div className="home-title">User List</div>
          <div className="home-userlist">
            {/* //optional training */}
            {listPeople?.map(person => {
              return (
                <div className="user-container">
                  <div className="home-user">{person.username}</div>
                  <div className="delete-user" onClick={() => handleDelete(person.id)}>
                    {" "}
                    Delete{" "}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </Box>
    </>
  );
};

export default Population;
