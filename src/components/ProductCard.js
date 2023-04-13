import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";
//sx={{mr:1}}
const ProductCard = ({ product, handleAddToCart }) => {
  // console.log(product);
  return (
    <Card className="card">
      <CardMedia
        component="img"
        height="140"
        image={product.image}
        alt={product.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {product.name}
        </Typography>
        <Typography gutterBottom variant="h5" component="div" sx={{fontWeight: 'bold'}}>
          ${product.cost}
        </Typography>
        <Typography variant="h5" component="div">
        <Rating name="read-only" value={product.rating} readOnly />
        </Typography>
      </CardContent>
      <CardActions className="card-actions">
        <Button variant="contained" className="card-button" startIcon={<AddShoppingCartOutlined alt="QKart-icon"/>} onClick={handleAddToCart}>ADD TO CART</Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
