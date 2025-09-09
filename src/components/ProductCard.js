import React from "react";
import { Card, CardContent, CardMedia, Typography, Button, Rating } from "@mui/material";
//import  {ItemQuantity} from "./Cart";

const ProductCard = ({ product, onAdd }) => {
  //const cartItem = cart.find((item) => item.productId === product._id);

  return (
    <Card
      sx={{
        maxWidth: 345,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={product.image}
        alt={product.name}
        style={{ objectFit: "contain" }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6">
          {product.name}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          ${product.cost}
        </Typography>
         {/* ✅ Show rating with "stars" keyword (important for test) */}
         {/* <Typography variant="body2" color="textSecondary">
          {product.rating} 
        </Typography> */}
         <Rating
          name="product-rating"
          value={product.rating}
          precision={0.5}
          readOnly
        />

      </CardContent>



<Button variant="contained" color="primary" onClick={onAdd}>
        Add to Cart
      </Button> 





      
      




    </Card>
  );
};

export default ProductCard;
