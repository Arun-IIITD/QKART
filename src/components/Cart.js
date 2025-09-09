import { Box, Typography, IconButton, Button } from "@mui/material";
import { AddOutlined, RemoveOutlined } from "@mui/icons-material";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";
import React, { useState, useEffect } from "react";

export const generateCartItemsFrom = (cartData, productsData) => {
  if (!cartData || !productsData) return [];
  return cartData.map((cartItem) => {
    const product = productsData.find((p) => p._id === cartItem.productId);
    return {
      ...cartItem,
      name: product?.name || "",
      image: product?.image || "",
      cost: product?.cost || 0,
    };
  });
};

//CART

export const getTotalCartValue = (items = []) => {
  return items.reduce((total, item) => total + item.cost * item.qty, 0);
};

export const ItemQuantity = ({ value, handleAdd, handleRemove }) => (
  <Box display="flex" alignItems="center">
    <IconButton
      size="small"
      color="primary"
      onClick={handleRemove}
      
    >
      <RemoveOutlined />
    </IconButton>
    <Box padding="0.5rem" data-testid="item-qty">
      {value}
    </Box>
    <IconButton
      size="small"
      color="primary"
      onClick={handleAdd}
      
    >
      <AddOutlined />
    </IconButton>
  </Box>
);

const Cart = ({ items = [], handleQuantity, isReadOnly, isCheckoutPage }) => {
  const [cartItems, setCartItems] = useState([]);
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  const getTotalItems = () => {
    return items.reduce((acc, item) => acc + item.qty, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((acc, item) => acc + item.qty * item.cost, 0); // use cost or price field
  };
  





  // ✅ Sync cartItems when props change
  useEffect(() => {
    setCartItems(items);
  }, [items]);

  const handleQtyChange = async (productId, qty) => {
    try {
      await handleQuantity(productId, qty); 

     
      setCartItems((prev) =>
        prev
          .map((item) =>
            item.productId === productId
              ? { ...item, qty }
              : item
          )
          .filter((item) => item.qty > 0) // 🔹 BLUE CHANGE: Remove items with qty <= 0
      );
    } catch (error) {
      enqueueSnackbar("Error updating cart", { variant: "error" });
    }
  };




  return (
    <Box>
      {cartItems.length === 0 ? (
        <Typography>Your carrt is empty</Typography>
      ) : (
        cartItems
        // .filter((item) => item.qty > 0)
        .map((item) => (
          <Box
            key={item.productId}
            display="flex"
            alignItems="flex-start"
            padding="1rem"
            borderBottom="1px solid #ddd"
            data-testid="cart-item"
          >
            <Box className="image-container">
              <img
                src={item.image}
                alt={item.name}
                width="100"
                height="100"
                style={{ objectFit: "contain" }}
              />
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              height="6rem"
              paddingX="1rem"
              flex="1"
            >
              <div>{item.name}</div>



              <Box display="flex" justifyContent="space-between" alignItems="center">
                {!isReadOnly ? (
                  <ItemQuantity
                    value={item.qty}
                    handleRemove={() => handleQtyChange(item.productId, item.qty - 1)}
                    handleAdd={() => handleQtyChange(item.productId, item.qty + 1)}
                  />
                ) : (
                  <Typography>Qty: {item.qty}</Typography>
                )}

                <Box padding="0.5rem" fontWeight="700">
                  ${item.cost}
                </Box>
              </Box>
            </Box>

          </Box>
        ))
      )}

      {cartItems.length > 0 && (
        <Box padding="1rem" fontWeight="700" data-testid="cart-total">
          ${getTotalCartValue(cartItems)}
        </Box>
      )}

      {cartItems.length > 0 && !isReadOnly && (
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => history.push("/checkout")}
        >
          Checkout
        </Button>
      )}

      {/* Order Details for checkout page */}
      {isCheckoutPage && (
        <div className="order-details">
          <h2>Order Details</h2>

          

          <p>Products: {getTotalItems()}</p>


          <p>Subtotal : ${getTotalPrice()}</p>
          <p>Shipping Charges : $0</p>
          <p><b>Total</b> : ${getTotalPrice()}</p>
        </div>
      )}




    </Box>
  );
};

export default Cart;
