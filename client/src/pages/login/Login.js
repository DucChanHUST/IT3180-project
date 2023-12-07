import * as React from "react";
import Box from "@mui/material/Box";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../redux/apiRequest";
import { toast, ToastContainer } from "react-toastify"; // Import toast for displaying error messages
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "react-toastify/dist/ReactToastify.css"; // Import CSS for toastify

const SignIn = () => {
  const defaultTheme = createTheme();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  //hàm xử lí login -------------------------------
  const handleSubmit = async event => {
    event.preventDefault(); // ngăn trang reload lại

    if (!username || !password) {
      toast.error("Username and password are required");
      return;
    }
    const newUser = {
      username: username,
      password: password,
    };
    loginUser(newUser, dispatch, navigate);
  };

  //Hàm xử lí logout

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, backgroundColor: "bluewhite" }}>
            <LockOutlinedIcon sx={{ color: "white" }} />
          </Avatar>
          <Typography component="h1" variant="h5">
            Đăng nhập
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
            className={username && password ? "active" : ""}
            // Chú ý: Bạn không nên sử dụng 'disable' như một thuộc tính trực tiếp trên thẻ 'Box'
          >
            <TextField
              margin="normal"
              required
              fullWidth
              label="Tài khoản"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Mật khẩu"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={!username || !password}>
              Đăng nhập
            </Button>
          </Box>
        </Box>
      </Container>
      <ToastContainer autoClose={3000} position="top-right" hideProgressBar />
    </ThemeProvider>
  );
};

export default SignIn;
