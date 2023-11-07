import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { toast, ToastContainer } from "react-toastify"; // Import toast for displaying error messages
import "react-toastify/dist/ReactToastify.css"; // Import CSS for toastify
import axios from "axios"; // Import Axios or your preferred HTTP library
import { loginUser } from "../../redux/apiRequest";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function SignIn() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const defaultTheme = createTheme();

  //hàm xử lí login -------------------------------
  const handleSubmit = async event => {
    event.preventDefault(); // ngăn trang reload lại

    if (!username || !password)
    {
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
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
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
              id="username"
              label="Username"
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
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={!username || !password}>
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      <ToastContainer autoClose={3000} position="top-right" hideProgressBar />
    </ThemeProvider>
  );
}

export default SignIn;
