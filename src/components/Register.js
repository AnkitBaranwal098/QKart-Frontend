import { Link,useHistory } from "react-router-dom";
import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  const [formData, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [registerState, setRegister] = useState(200);
  const history = useHistory();

  const triggerSnackbar = (message, variantType) => {
    enqueueSnackbar(message, {
      variant: variantType,
      preventDuplicate: true,
      anchorOrigin: { vertical: "bottom", horizontal: "center" },
      autoHideDuration: 4000,
    });
  };

  const register = async (event) => {
    if (validateInput(formData)) {
      setRegister(202);
      try {
        const url = config.endpoint + "/auth/register";
        const response = await axios.post(url, {
          username: formData.username,
          password: formData.password,
        });
        console.log(response);
        setForm({ username: "", password: "", confirmPassword: "" });
        triggerSnackbar("Registered successfully", "success");
        history.push('/login')
        setRegister(200);
      } catch (e) {
        //Username exists
        if (e.response && e.response.status === 400) {
          // console.log("Inside if ", e.toJSON().status);
          // console.log(e.toJSON());
          setRegister(200);
          return triggerSnackbar(e.response.data.message, "error");
        }
        //Server not available
        else {
          // console.log("Inside else");
          // console.log(e.toJSON().status);
          // triggerSnackbar(
          //   "Something went wrong. Check that the backend is running, reachable and returns valid JSON",
          //   "error"
          // );
          setRegister(200);
          return triggerSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON.", "error");
        }
        // return e;
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = (formData) => {
    if (formData.username === "") {
      triggerSnackbar("Username is a required field", "warning");
      return false;
    } else if (formData.username.length < 6) {
      triggerSnackbar("Username must be at least 6 characters", "warning");
      return false;
    } else if (formData.password === "") {
      triggerSnackbar("Password is a required field", "warning");
      return false;
    } else if (formData.password.length < 6) {
      triggerSnackbar("Password must be at least 6 characters", "warning");
      return false;
    } else if (formData.password !== formData.confirmPassword) {
      triggerSnackbar("Passwords do not match", "warning");
      return false;
    } else return true;
  };
  const getInput = (event) => {
    const [key, value] = [event.target.name, event.target.value];
    setForm({ ...formData, [key]: value });
  };
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            value={formData.username}
            onChange={getInput}
            fullWidth
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            value={formData.password}
            onChange={getInput}
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={getInput}
            fullWidth
          />
          {registerState === 200 && (
            <Button className="button" variant="contained" onClick={register}>
              Register Now
            </Button>
          )}
          {registerState === 202 && (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          )}
          {/* <Button className="button" variant="contained" onClick={register}>
            Register Now
          </Button> */}
          <p className="secondary-action">
            Already have an account?{" "}
            <Link className="link" to="/login">
              Login here
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
