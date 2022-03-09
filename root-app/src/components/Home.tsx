import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import LogoutIcon from "@mui/icons-material/Logout";
import CssBaseline from "@mui/material/CssBaseline";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Redirect } from "react-router-dom";
import JSONPretty from "react-json-pretty";
import Copyright from "../shared/components/Copyright";
import HomeConst from "../shared/constants/HomeConst";
import TextField from "@mui/material/TextField";
var JSONPrettyMon = require("react-json-pretty/dist/monikai");

const cards = [1, 2];

const theme = createTheme();

export default function Home() {
  const [loggedIn, setLoggedIn] = useState<boolean>(true);
  const [fixerAccessKey, setFixerAccessKey] = useState<string | null>(null);
  const [bmxToken, setBmxToken] = useState<string | null>(null);
  const [currentExchangeRate, setCurrentExchangeRate] = useState<any>({});

  const logout = () => {
    sessionStorage.removeItem("token");
    setLoggedIn(false);
  };

  const getExchangeRateData = () => {
    const token = sessionStorage.getItem("token");
    console.log(fixerAccessKey, bmxToken);
    fetch("http://localhost:8080/api/currency/get_current_exchange_rate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        fixer_access_key: fixerAccessKey,
        bmx_token: bmxToken,
      }),
    })
      .then((response) => {
        if (response.status !== 200) {
          if (response.status === 401) {
            logout();
            throw Error(
              "Your token has expired or it is invalid. Please Sign in again."
            );
          }
          throw Error("There was a problem with the request");
        } else {
          return response.json();
        }
      })
      //Then with the data from the response in JSON...
      .then((data) => {
        console.log("Success:", data);
        setCurrentExchangeRate(data);
      })
      //Then with the error genereted...
      .catch((error) => {
        alert(error);
        console.error("Error:", error);
      });
  };

  return !loggedIn ? (
    <Redirect
      to={{
        pathname: "/",
      }}
    />
  ) : (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <IconButton
            aria-label="logout"
            onClick={() => {
              logout();
            }}
          >
            <LogoutIcon sx={{ mr: 2 }} />
          </IconButton>

          <Typography variant="h6" color="inherit" noWrap>
            {HomeConst.SignOutTitle}
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: "background.paper",
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="lg">
            <Typography
              component="h4"
              variant="h4"
              align="center"
              color="text.primary"
              gutterBottom
            >
              {HomeConst.HomeTitle}
            </Typography>
            <Stack
              sx={{ pt: 2, pb: 2 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <TextField
                id="fixer-access-token"
                label="Fixer Access Token"
                variant="standard"
                value={fixerAccessKey}
                onChange={(e: any) => {
                  setFixerAccessKey(e.target.value);
                }}
              />
              <TextField
                id="bmx-token"
                label="Bmx-Token"
                variant="standard"
                value={bmxToken}
                onChange={(e: any) => {
                  setBmxToken(e.target.value);
                }}
              />
            </Stack>
            <Typography
              component="p"
              align="left"
              color="text.primary"
              gutterBottom
            >
              <JSONPretty
                id="json-pretty"
                data={currentExchangeRate}
                theme={JSONPrettyMon}
              ></JSONPretty>{" "}
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                getExchangeRateData();
              }}
            >
              {HomeConst.FirstActionTitle}
            </Button>
          </Container>
        </Box>
      </main>
      <Copyright sx={{ mt: 8, mb: 4 }} title={HomeConst.AppName} />
    </ThemeProvider>
  );
}
