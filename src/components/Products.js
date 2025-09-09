import React, { useEffect, useState } from "react";
import { Grid, Box, CircularProgress, Typography } from "@mui/material";
import Header from "./Header";
import Footer from "./Footer";
import ProductCard from "./ProductCard";
import { config } from "../App";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import "./Products.css";
import Cart, { generateCartItemsFrom } from "./Cart";
import { useSnackbar } from "notistack";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartData, setCartData] = useState([]);
  const [error, setError] = useState(null);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  // const isItemInCart = (items, productId) => {
  //   return items.find((item) => item.productId === productId);
  // };

  // ✅ Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${config.endpoint}/products`);
      setProducts(response.data || []);
    } catch (error) {
      setProducts([])
      setError(error.response?.statusText || error.message);
    } finally {
      setLoading(false);
    }
  };



  // ✅ Search products
  const performSearch = async (text) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${config.endpoint}/products/search?value=${text}`
      );
      setProducts(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        setProducts([]);
      } else {
        setError(
          error.response
            ? `Failed to search: ${error.response.status} ${error.response.statusText}`
            : error.message
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const debounceSearch = (event) => {
    const value = event.target.value;
    if (debounceTimeout) clearTimeout(debounceTimeout);
    const newTimeout = setTimeout(() => {
      if (value.trim() === "") fetchProducts();
      else performSearch(value.trim());
    }, 500);
    setDebounceTimeout(newTimeout);
  };

  // ✅ Fetch cart
  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await axios.get(`${config.endpoint}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartData(response.data);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };


// const handleAddToCart = async (productId, qty = 1) => {


//   if (!isLoggedIn) { enqueueSnackbar("Please login first", { variant: "warning" }); return; }
//   if (cartData.some(item => item.productId === productId)) {
//     enqueueSnackbar("Item already in cart", { variant: "info" });
//     return;
//   }
//   try {
//     await axios.post(`${config.endpoint}/cart`, { productId, qty }, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
//     setCart(res.data);
//     await fetchCart();
//     enqueueSnackbar("Item added to cart", { variant: "success" });
//   } catch (err) {
//     enqueueSnackbar("Failed to add item to cart", { variant: "error" });
//   }
// };


// const handleQuantity = async (productId, newQty) => {
//   const token = localStorage.getItem("token");
//   if (!token) {
//     enqueueSnackbar("You must be logged in to update cart", { variant: "warning" });
//     return;
//   }

//   try {
//     if (newQty < 1) {
//       await axios.post(
//         `${config.endpoint}/cart`,
//         { productId, qty: 0 },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       await fetchCart();
//       enqueueSnackbar("Item removed from cart", { variant: "info" });
//       return;
//     }

//     await axios.post(
//       `${config.endpoint}/cart`,
//       { productId, qty: newQty },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     // ✅ only fetchCart will sync UI
//     await fetchCart();
//     enqueueSnackbar("Quantity updated", { variant: "success" });

//   } catch (err) {
//     enqueueSnackbar("Failed to update quantity", { variant: "error" });
//     console.error("Error updating quantity:", err);
//   }
// };

const handleAddToCart = async (productId, qty = 1) => {
  if (!isLoggedIn) {
    enqueueSnackbar("Login to add an item to the Cart", { variant: "warning" });
    return;
  }

  if (qty === 1 && cartData.some(item => item.productId === productId)) {
    enqueueSnackbar(
      "Item already in cart. Use the cart sidebar to update quantity or remove item.",
      { variant: "warning" }
    );
    return;
  }

  try {
    const res = await axios.post(
      `${config.endpoint}/cart`,
      { productId, qty },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    setCartData(res.data);
    enqueueSnackbar("Item added to cart", { variant: "success" });
  } catch (err) {
    enqueueSnackbar("Failed to add item to cart", { variant: "error" });
  }
};

const handleQuantity = async (productId, newQty) => {
  if (!isLoggedIn) {
    enqueueSnackbar("You must be logged in to update cart", { variant: "warning" });
    return;
  }

  try {
    const res = await axios.post(
      `${config.endpoint}/cart`,
      { productId, qty: newQty < 1? 0 : newQty },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );

    setCartData(res.data);

    if (newQty < 1) {
      enqueueSnackbar("Item removed from cart", { variant: "info" });
    } else {
      enqueueSnackbar("Quantity updated", { variant: "success" });
    }
  } catch (err) {
    enqueueSnackbar("Failed to update quantity", { variant: "error" });
  }
};















  // ✅ On mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchCart();
    }
    fetchProducts();
  }, []);

  // const cartItems = generateCartItemsFrom(cartData, products);

  return (
    <div>
      <Header hasHiddenAuthButtons={false}>
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search for items/categories"
            className="search-input"
            onChange={debounceSearch}
          />
          <SearchIcon className="search-icon" />
        </div>
      </Header>

      <Grid container spacing={2} sx={{ mt: 4, px: 2 }}>
        <Grid item xs={12}>
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your doorstep
            </p>
          </Box>

          {loading && (
            <Box textAlign="center" mt={4}>
              <CircularProgress />
              <Typography variant="h6">Loading Products</Typography>
            </Box>
          )}

          {error && (
            <Typography color="error" variant="h6" textAlign="center" mt={4}>
              {error}
            </Typography>
          )}

          {!loading && !error && products.length === 0 && (
            <Typography variant="h6" textAlign="center" mt={4}>
              No Products Found
            </Typography>
          )}

          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            gap={2}
            mt={2}
          >
            <Box flex={3}>
              <Grid container spacing={2}>
                {products.map((product) => (
                  <Grid item xs={6} md={4} lg={3} key={product._id}>
                    <ProductCard
                    key={product._id}
                    product={product}
                    // handleAddToCart={() => handleAddToCart(product._id,1)}
                    // handleAddToCart={handleAddToCart}
                    // handleQuantity={handleQuantity}
                    // cart={cartData}
                    onAdd={() => handleAddToCart(product._id, 1)}

                    />
                  </Grid>
                ))}
              </Grid>
            </Box>

            {isLoggedIn && (
              <Box flex={1}>
                <Cart
                  products={products}
                  items={generateCartItemsFrom(cartData,products)}
                  handleQuantity={handleQuantity}
                
                />
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>

      <Footer />
    </div>
  );
};

export default Products;
