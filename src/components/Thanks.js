import { Button } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import "./Thanks.css";
import {rem_bal} from "./Checkout";
// import axios from "axios";
// import { config } from "../App";



const Thanks = () => {
  const history = useHistory();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    // Assuming cart items are saved in localStorage as JSON string
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const remaining = rem_bal(cartItems);
    setBalance(remaining);
  }, []);
 

  
 

  const routeToProducts = () => {
    history.push("/");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      history.push("/");
    }
  }, [history]);

  return (
    <>
      <Header />
      <Box className="greeting-container">
        <h2>Yay! It's ordered 😃</h2>
        <p>You will receive an invoice for your order shortly.</p>
        <p>Your order will arrive in 7 business days.</p>
        <p id="balance-overline">Wallet Balance</p>
        <p id="balance">${balance} Available</p>
        <Button
          variant="contained"
          size="large"
          id="continue-btn"
          onClick={routeToProducts}
        >
          Continue Shopping
        </Button>
      </Box>
      <Footer />
    </>
  );
};

export default Thanks;
