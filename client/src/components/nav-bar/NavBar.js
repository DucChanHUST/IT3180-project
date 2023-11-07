import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useAppStore } from "../../stores";
import { NavLink, useNavigate } from "react-router-dom";
import { PathConstant } from "../../const";
import { useSelector } from "react-redux";
import "./Navbar.css";

// Cấu hình
const AppBar = styled(
  MuiAppBar,
  {},
)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
}));

///Hàm chính
const NavBar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const updateOpen = useAppStore(state => state.updateOpen);
  const dopen = useAppStore(state => state.dopen);
  const isMenuOpen = Boolean(anchorEl);

  // user
  const user = useSelector(state => state.auth.login.currentUser);

  //-----------------------------------------

  const handleProfileMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = "account-menu";

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem>
        <NavLink to="/Profile/userid">Profile</NavLink>
      </MenuItem>
      <MenuItem>
        <NavLink to="/Profile/userid">My account</NavLink>
      </MenuItem>
      <MenuItem>Log out</MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" sx={{ mr: 2 }} onClick={() => updateOpen(!dopen)}>
            <MenuIcon />
          </IconButton>
          <Typography
            onClick={() => {
              navigate(PathConstant.ROOT);
            }}
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block", } }}
          >
            QL
          </Typography>

          {user ? (
            <>
              <p className="username">
                {" "}
                Hi,
                <span> {user.username}</span>
              </p>

              <Box sx={{ flexGrow: 1 }} />
              <Box sx={{ display: { xs: "none", md: "flex" } }}>
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
              </Box>
            </>
          ) : (
            <Button
              sx={{
                marginRight: "0",
                marginLeft: "auto",
                color: "white",
                fontSize: "15px",
                backgroundColor: "white", // Màu nền xanh
                "&:hover": {
                  backgroundColor: "gray", // Màu nền xám khi hover
                },
              }}
            >
              <NavLink to="/Login" sx={{ color: "white" }}>
                Login
              </NavLink>
            </Button>
          )}
        </Toolbar>
      </AppBar>
      {renderMenu}
    </Box>
  );
};

export default NavBar;
