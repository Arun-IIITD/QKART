import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
//import SearchIcon from "@mui/icons-material/Search";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Header.css";

const Header = ({ hasHiddenAuthButtons, children}) => {
  const history = useHistory();
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

 // const [debounceTimeout, setDebounceTimeout] = useState(null);

  // const debounceSearch = (event) => {
  //   if (debounceTimeout) {
  //     clearTimeout(debounceTimeout);
  //   }
  //   const value = event.target.value;
  //   const newTimeout = setTimeout(() => {
  //     if (onSearch) onSearch(value);
  //   }, 500);
  //   setDebounceTimeout(newTimeout);
  // };

  const handleLogout = () => {
    localStorage.clear();
    history.push("/");
    window.location.reload();
  };

  return (
    <>
      <Box className="header">
        {/* Logo */}
        <Box className="header-title" onClick={() => history.push("/")}>
          <img src="logo_light.svg" alt="QKart-icon" />
        </Box>
  
   

      {children && <Box className="search-container desktop-only">{children}</Box>}
  
        {/* Auth Buttons */}
        {hasHiddenAuthButtons ? (
          <Button
            className="explore-button"
            startIcon={<ArrowBackIcon />}
            variant="text"
            onClick={() => history.push("/")}
          >
            Back to explore
          </Button>
        ) : (
          <Stack direction="row" spacing={2} alignItems="center">
            {token ? (
              <>
                <Avatar src="avatar.png" alt={username}>
                  {username ? username[0].toUpperCase() : ""}
                </Avatar>
                <span>{username}</span>
                <Button variant="contained" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="text" onClick={() => history.push("/login")}>
                  Login
                </Button>
                <Button variant="contained" onClick={() => history.push("/register")}>
                  Register
                </Button>
              </>
            )}
          </Stack>
        )}
      </Box>
  
      {/* Mobile search bar (outside header, below it) */}
      {/* <Box className="search-wrapper mobile-only">
        <input
          type="text"
          placeholder="Search for items/categories"
          className="search-input"
          onChange={debounceSearch}
        />
        <SearchIcon className="search-icon" />
      </Box> */}
       <Box className="mobile-only">{children}</Box>
    </>
  );
            }
  

export default Header;
