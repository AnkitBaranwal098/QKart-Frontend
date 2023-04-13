import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import { useHistory } from "react-router-dom";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons }) =>
 {
  const history = useHistory();
  const username = localStorage.getItem("username");

  const logOutFun = ()=>{
    localStorage.clear();
    history.push('/');
    window.location.reload();
  }
  const navigateToProducts = ()=>{
    history.push("/");
  }
  const navigateToLogIn = ()=>{
    history.push("/login");
  }
  const navigateToRegister = ()=>{
    history.push("/register");
  }
  // console.log(children)
  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>

      {hasHiddenAuthButtons && (
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={navigateToProducts}
          >
            BACK TO EXPLORE
        </Button>
      )}

      {!hasHiddenAuthButtons && (
        <>
        {children}
        <Stack direction="row" display="flex" justifyContent="center" alignItems="center" spacing={2}>
          {localStorage.length === 0 ? (
            <>
              <Button variant="text" onClick={navigateToLogIn}> LOGIN </Button>
              <Button variant="text" onClick={navigateToRegister}> REGISTER</Button>
            </>
          ) : (
            <>
              <Avatar src="avatar.png" alt={username} sx={{ mr:1 }}/>
              {username}
              <Button variant="text" onClick={logOutFun}>LOGOUT</Button>
            </>
          )}
        </Stack>
        </>
      )}

      {/* <Button
        className="explore-button"
        startIcon={<ArrowBackIcon />}
        variant="text"
      >
        <Link className="link" to="/products">
          BACK TO EXPLORE
        </Link>
      </Button> */}
    </Box>
  );
};

export default Header;
