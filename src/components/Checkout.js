import { CreditCard } from "@mui/icons-material";
import {
  Button,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { config } from "../App";
import Cart, { getTotalCartValue, generateCartItemsFrom } from "./Cart";
import "./Checkout.css";
import Footer from "./Footer";
import Header from "./Header";

export const rem_bal = (items) => {
  const totalCost = getTotalCartValue(items);
  const balance = parseInt(localStorage.getItem("balance")) || 0;

  if (balance > totalCost) {
    console.log(balance - totalCost)
    return balance - totalCost;
  }

  return balance; 
};


const AddNewAddressView = ({ token, newAddress, handleNewAddress, addAddress }) => {
  return (
    <Box display="flex" flexDirection="column">
      <TextField
        multiline
        minRows={4}
        placeholder="Enter your complete address"
        value={newAddress.value}
        onChange={(e) =>
          handleNewAddress({ ...newAddress, value: e.target.value })
        }
      />
      <Stack direction="row" my="1rem" spacing={2}>
        <Button
          variant="contained"
          onClick={async () => {
            if (!newAddress.value.trim()) return; 
            const addresses = await addAddress(token, newAddress.value);
            if (addresses?.length) {
              const lastAdded = addresses[addresses.length - 1];
              handleNewAddress({ isAddingNewAddress: false, value: "", id: lastAdded._id });
            }
          }}
        >
          Add
        </Button>
        <Button
          variant="text"
          onClick={() =>
            handleNewAddress({ isAddingNewAddress: false, value: "" })
          }
        >
          Cancel
        </Button>
      </Stack>
    </Box>
  );
};




// const AddNewAddressView = ({
//   token,
//   newAddress,
//   handleNewAddress,
//   addAddress,
// }) => {
//   return (
//     <Box display="flex" flexDirection="column">
//       <TextField
//         multiline
//         minRows={4}
//         placeholder="Enter your complete address"
//         value={newAddress.value}
//         onChange={(e) =>
//           handleNewAddress({ ...newAddress, value: e.target.value })
//         }
//       />
//       <Stack direction="row" my="1rem">


//         <Button
//           variant="contained"
         
//           onClick={async() => {
//             await addAddress(token, newAddress.value);
//             handleNewAddress({ isAddingNewAddress: false, value: "" });
//           }}
//         >
//           Add
//         </Button>


//         <Button
//           variant="text"
         
         
//           onClick={() =>
//             handleNewAddress({ isAddingNewAddress: false, value: "" })
//           }
//         >
//           cancel
//         </Button>
//       </Stack>
//     </Box>
//   );
// };

const Checkout = () => {
  const token = localStorage.getItem("token");
  const history = useHistory();
  const [balance, setBalance] = useState(parseInt(localStorage.getItem("balance")) || 0);

  const { enqueueSnackbar } = useSnackbar();
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [addresses, setAddresses] = useState({ all: [], selected: "" });
  const [newAddress, setNewAddress] = useState({
    isAddingNewAddress: false,
    value: "",
  });

  const getProducts = async () => {
    try {
      const response = await axios.get(`${config.endpoint}/products`);
      setProducts(response.data);
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 500) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
        return null;
      } else {
        enqueueSnackbar(
          "Could not fetch products. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
    }
  };

  const fetchCart = async (token) => {
    if (!token) return;
    try {
      const response = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch {
      enqueueSnackbar(
        "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
        {
          variant: "error",
        }
      );
      return null;
    }
  };

  const fetchaddress = async (token) => {
    if (!token) return;
    try {
      const response = await axios.get(`${config.endpoint}/user/addresses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAddresses({ all: response.data, selected: "" });
      return response.data;
    } catch (error) {
      enqueueSnackbar(
        "Could not fetch addresses. Check that the backend is running, reachable and returns valid JSON.",
        { variant: "error" }
      );
      return null;
    }
  };


  const addAddress = async (token, newAddressValue) => {
    if (!token) return;
    try {
      const response = await axios.post(
        `${config.endpoint}/user/addresses`,
        { address: newAddressValue }, // always use newAddress.value here
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      // Update addresses state with the latest list from backend
      setAddresses({ all: response.data, selected: "" });
  
      // Reset newAddress input
      setNewAddress({ isAddingNewAddress: false, value: "", id: response.data.at(-1)._id });
  
      enqueueSnackbar("Address added successfully", { variant: "success" });
      return response.data;
    } catch (e) {
      enqueueSnackbar(
        e.response?.data?.message || "Could not add this address. Check backend connectivity.",
        { variant: "error" }
      );
    }
  };
  

  // const addAddress = async (token, newAddressValue) => {
  //   if (!token) return;
  //   try {
  //     const response = await axios.post(
  //       `${config.endpoint}/user/addresses`,
  //       { address: newAddressValue },
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );
  
  //     // response.data is an array of all addresses including the new one
  //     const addedAddress = response.data[response.data.length - 1]; // last one is newly added
  
  //     setAddresses({ all: response.data, selected: "" });
  
  //     // Update newAddress state to include the generated id (optional)
  //     setNewAddress({
  //       isAddingNewAddress: false,
  //       value: "",
  //       id: addedAddress._id
  //     });
  
  //     enqueueSnackbar("Address added successfully", { variant: "success" });
  //     return response.data;
  //   } catch (e) {
  //     if (e.response) {
  //       enqueueSnackbar(e.response.data.message, { variant: "error" });
  //     } else {
  //       enqueueSnackbar(
  //         "Could not add this address. Check backend connectivity.",
  //         { variant: "error" }
  //       );
  //     }
  //   }
  // };
  




  const deleteAddress = async (token, addressId) => {
    if (!token) return;
    try {
      const response = await axios.delete(
        `${config.endpoint}/user/addresses/${addressId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAddresses({ all: response.data, selected: [] });
      enqueueSnackbar("Address deleted successfully", { variant: "success" });
      return response.data;
    } catch (e) {
      if (e.response) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not delete this address. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
    }
  };

  const validateRequest = (items, addresses) => {
    const totalCost = getTotalCartValue(items);
    const balance = parseInt(localStorage.getItem("balance")) || 0;
    

    if (totalCost > balance) {
      enqueueSnackbar(
        "You do not have enough balance in your wallet for this purchase",
        { variant: "warning" }
      );
      return false;
    }

    if (addresses.all.length === 0) {
      enqueueSnackbar("Please add a new address before proceeding.", {
        variant: "warning",
      });
      return false;
    }

    if (!addresses.selected) {
      enqueueSnackbar("Please select one shipping address to proceed.", {
        variant: "warning",
      });
      return false;
    }

    return true;
  };



  const performCheckout = async (token, items, addresses) => {
    if (!validateRequest(items, addresses)) return false;
  
    try {
      const response = await axios.post(
        `${config.endpoint}/cart/checkout`,
        { addressId: addresses.selected },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (response.data.success) {
        if (response.data.balance !== undefined) {
          localStorage.setItem("balance", response.data.balance);
          setBalance(response.data.balance);
        }
        enqueueSnackbar("Order placed successfully!", { variant: "success" });
        history.push("/thanks", { balance: response.data.balance });
       
        return true;
      } else {
        enqueueSnackbar(response.data.message, { variant: "error" });
        return false;
      }
    } catch (e) {
      if (e.response?.data?.message) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar("Checkout failed. Please try again.", { variant: "error" });
      }
      return false;
    }
  };
  



  useEffect(() => {
    const onLoadHandler = async () => {
      await fetchaddress(token);
      const productsData = await getProducts();
      const cartData = await fetchCart(token);
      if (productsData && cartData) {
        const cartDetails = await generateCartItemsFrom(cartData, productsData);
        setItems(cartDetails);
      }
    };
    onLoadHandler();
  }, []);

  return (
    <>
      <Header />
      <Grid container>
        <Grid item xs={12} md={9}>
          <Box className="shipping-container" minHeight="100vh">
            <Typography color="#3C3C3C" variant="h4" my="1rem">
              Shipping
            </Typography>
            <Typography color="#3C3C3C" my="1rem">
              Manage all the shipping addresses you want. This way you won't
              have to enter the shipping address manually with every order.
              Select the address you want to get your order delivered.
            </Typography>
            <Divider />

            <Box my={2}>
              {addresses.all.length === 0 ? (
                <Typography my="1rem">
                  No addresses found for this account. Please add one to proceed
                </Typography>
              ) : (
                addresses.all.map((addr) => (
                  <Box
                    key={addr._id}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    my={1}
                    p={1}
                    border="1px solid #ccc"
                    borderRadius="8px"
                    sx={{
                      cursor: "pointer",
                      backgroundColor:
                        addresses.selected === addr._id ? "#E9F5E1" : "white",
                    }}
                    onClick={() =>
                      setAddresses({ ...addresses, selected: addr._id })
                    }
                  >
                    <Typography>{addr.address}</Typography>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteAddress(token, addr._id);
                      }}
                    >
                      Delete
                    </Button>
                  </Box>
                ))
              )}
            </Box>


{/* 
            <Button
              color="primary"
              variant="contained"
              // id="add-new-btn"
              id="add-new-btn" 
              size="large"
              onClick={() => {
                setNewAddress((currNewAddress) => ({
                  ...currNewAddress,
                  isAddingNewAddress: true,
                }));
              }}
            >
              Add new address
            </Button>

            {newAddress.isAddingNewAddress ? (
            <AddNewAddressView
              token={token}
              newAddress={newAddress}
              handleNewAddress={setNewAddress}
              addAddress={addAddress}
            />
          ) : null} */}

          {!newAddress.isAddingNewAddress ? (
              <Button
                color="primary"
                variant="contained"
                size="large"
                onClick={() =>
                  setNewAddress({ ...newAddress, isAddingNewAddress: true })
                }
                data-testid="add-new-address-btn"
              >
                Add new address
              </Button>
            ) : (
              <AddNewAddressView
                token={token}
                newAddress={newAddress}
                handleNewAddress={setNewAddress}
                addAddress={addAddress}
              />
            )}




         

            <Typography color="#3C3C3C" variant="h4" my="1rem">
              Payment
            </Typography>
            <Typography color="#3C3C3C" my="1rem">
              Payment Method
            </Typography>
            <Divider />

            <Box my="1rem">
              <Typography>Wallet</Typography>
                      <Typography>
          Pay ${getTotalCartValue(items)} of available ${balance}
        </Typography>

              
            </Box>

            <Button
              startIcon={<CreditCard />}
              variant="contained"
              onClick={() => performCheckout(token, items, addresses)}
            >
              PLACE ORDER
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={3} bgcolor="#E9F5E1">
          <Cart
            isReadOnly
            products={products}
            isCheckoutPage={true}
            items={items}
          />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
};

export default Checkout;
