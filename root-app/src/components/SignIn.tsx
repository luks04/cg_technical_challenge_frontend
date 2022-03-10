import { useState } from "react";
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
import SignInConst from "../shared/constants/SignInConst";
import CoreConstants from "../shared/constants/CoreConstants";
import Copyright from "../shared/components/Copyright";
import { Redirect } from "react-router-dom";

const theme = createTheme();

export default function SignIn() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console
    const authData = {
      username: data.get("username"),
      password: data.get("password"),
    };
    signIn(authData);
  };

  const signIn = (authData: any) => {
    fetch(`${CoreConstants.BACKEND_HOST}/api/app/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(authData),
    })
      .then((response) => {
        if (response.status !== 200) {
          throw Error("There was a problem in the login request");
        } else {
          return response.json();
        }
      })
      //Then with the data from the response in JSON...
      .then((data) => {
        console.log("Success:", data);
        sessionStorage.setItem("token", data.token);
        setLoggedIn(true);
      })
      //Then with the error genereted...
      .catch((error) => {
        console.error("Error:", error);
        sessionStorage.removeItem("token");
        setLoggedIn(false);
      });
  };

  return loggedIn ? (
    <Redirect
      to={{
        pathname: "/home",
      }}
    />
  ) : (
    <ThemeProvider theme={theme}>
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
            {SignInConst.SignInTitle}
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label={SignInConst.UsernameLabel}
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label={SignInConst.PasswordLabel}
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label={SignInConst.RememberMeLabel}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {SignInConst.SignInTitle}
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  {SignInConst.ForgotPasswordTitle}
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {SignInConst.SignUpTitle}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} title={SignInConst.AppName} />
      </Container>
    </ThemeProvider>
  );
}
