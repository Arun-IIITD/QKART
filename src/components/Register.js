import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
//import Products from "./Products"
//import Login from "./Login";
import "./Products.css";
import Footer from "./Footer";
import Header from "./Header";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";


function Register() {
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();


  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

 // Validate user input
  const validateInput = (data) => {
    if (!data.username) {
      enqueueSnackbar("Username is a required field", { variant: "warning" });
      return false;
    }
    if (data.username.length < 6) {
      enqueueSnackbar("Username must be at least 6 characters", { variant: "warning" });
      return false;
    }
    if (!data.password) {
      enqueueSnackbar("Password is a required field", { variant: "warning" });
      return false;
    }
    if (data.password.length < 6) {
      enqueueSnackbar("Password must be at least 6 characters", { variant: "warning" });
      return false;
    }
    if (data.password !== data.confirmPassword) {
      enqueueSnackbar("Passwords do not match", { variant: "warning" });
      return false;
    }
    return true;
  };

  //Register user
  const register = async (formData) => {
    if (!validateInput(formData)) return;

    try {
      setLoading(true);
      const response = await axios.post(`${config.endpoint}/auth/register`, {
        username: formData.username,
        password: formData.password,
      });

      if (response.status === 201 && response.data.success) {
        enqueueSnackbar("Registered successfully!", { variant: "success" });
        history.push("/login");

      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar("Something went wrong. Try again later.", { variant: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" justifyContent="space-between" minHeight="100vh">
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">

          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter Username"
            fullWidth
          />

          <TextField
            id="password"
            label="Password"
            variant="outlined"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            helperText="Password must be at least 6 characters length"
            placeholder="Enter a password with minimum 6 characters"
            fullWidth
          />

          <TextField
            id="confirmPassword"
            label="Confirm Password"
            variant="outlined"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            fullWidth
          />

          <Button
            className="button"
            variant="contained"
            color = "primary"
            onClick={() => register(formData)}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Register Now"}
          </Button>

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
}

export default Register;
