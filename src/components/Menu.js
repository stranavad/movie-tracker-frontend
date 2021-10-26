import React from "react";
//Menu Bar
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export default function Menu(props) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Movie Tracker
          </Typography>
          {props.auth.currentUser ? (
            <Button color="inherit" onClick={props.signOut}>
              Sign Out
            </Button>
          ) : (
            <Button color="inherit" onClick={props.signIn}>
              Sign In
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
