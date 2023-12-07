import React, { useState } from "react";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import MuiAppBar from "@mui/material/AppBar";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useAppStore } from "../../stores";
import { PathConstant } from "../../const";
import { styled } from "@mui/material/styles";
import { NavLink, useNavigate } from "react-router-dom";

const AppBar = styled(
  MuiAppBar,
  {},
)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
}));

const NavBar = () => {
  const navigate = useNavigate();
  const dopen = useAppStore(state => state.dopen);
  const updateOpen = useAppStore(state => state.updateOpen);

  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem>
        <NavLink to={PathConstant.PROFILE}>Thông tin cá nhân</NavLink>
      </MenuItem>
      <MenuItem>
        <NavLink to={PathConstant.LOGIN}>Đăng xuất</NavLink>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" sx={{ mr: 2 }} onClick={() => updateOpen(!dopen)}>
            <MenuIcon />
          </IconButton>

          <Button
            size="large"
            color="inherit"
            sx={{ display: { xs: "none", sm: "block" } }}
            onClick={() => {
              navigate(PathConstant.HOMEPAGE);
            }}
          >
            Quản lí Cộng đồng Thôn 12
          </Button>

          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "flex" }}>
            <IconButton edge="end" size="large" color="inherit" aria-haspopup="true" onClick={handleProfileMenuOpen}>
              <AccountCircle />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </Box>
  );
};

export default NavBar;
