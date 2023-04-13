import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart, { generateCartItemsFrom } from "./Cart";
// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

// const product = {
//   name: "Tan Leatherette Weekender Duffle",
//   category: "Fashion",
//   cost: 150,
//   rating: 4,
//   image:
//     "https://crio-directus-assets.s3.ap-south-1.amazonaws.com/ff071a1c-1099-48f9-9b03-f858ccc53832.png",
//   _id: "PmInA797xJhMIPti",
// };

const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  //Original List of Products
  const [products, setProducts] = useState([]);
  //Filtered Products
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loader, setLoader] = useState(200);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [items, setItems] = useState([]);

  const token = localStorage.getItem("token");
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */

  const isItemInCart = (items, productId) => {
    return items.findIndex((item) => item.productId === productId) !== -1;
  };

  //Add to cart adds item to cart list for the first time
  const addToCart = async(token, items, productId, products, qty, calledFromAddToCartBtn=false) => {

    //Check if user is logged in or not
    if (!token) {
      enqueueSnackbar("Please log in to add item to cart", {
        variant: "warning",
      });
      return;
    }
    //Check if item already inside the cart
    if(calledFromAddToCartBtn && isItemInCart(items,productId))
    {
      enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item.",{
        variant : "warning"
      })
      return;
    }
    //Make a request to update/add new Product to the cart and once the response is fetched we update the cartList
    try
    {
      const response = await axios.post(`${config.endpoint}/cart`,{productId,qty},{
        headers : {
          Authorization : `Bearer ${token}`,
        },
      })
      const items = generateCartItemsFrom(response.data,products);
      setItems(items);
    }
    catch(error)
    {
      if(error.response)
      {
        enqueueSnackbar(error.response.data.message,{
          variant : "error"
        })
      }
      else{
        enqueueSnackbar("Could not fetch products. Check that the backend is running, reachable and returns valid JSON.",{
          variant : "error"
        })
      }
    }
  };

  const performAPICall = async () => {
    console.log("Config.backend ", config.endpoint);
    const url = config.endpoint + "/products";
    console.log(url);
    try {
      const response = await axios.get(url);
      const data = response.data;
      setProducts(data);
      setFilteredProducts(data);
      setLoader(201);
    } catch (error) {
      setLoader(201);
      console.log(error);
      if (error.response && error.response.status === 500) {
        enqueueSnackbar(error.response.data.message, {
          variant: "error",
        });
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

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    try {
      const url = `${config.endpoint}/products/search?value=${text}`;
      // console.log(url)
      const response = await axios.get(url);
      setFilteredProducts(response.data);
    } catch (e) {
      if (e.response) {
        if (e.response.status === 404) {
          setFilteredProducts([]);
        }
        if (e.response.status === 500) {
          enqueueSnackbar(e.response.data.message, {
            variant: "error",
          });
          setFilteredProducts(products);
        }
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
    if (!token) {
      return;
    }
    try {
      const response = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      enqueueSnackbar(
        "Could not fetch card details. Check the backend is running, reachable and returns valid JSON.",
        {
          variant: "error",
        }
      );
      return null;
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    const value = event.target.value;

    if (debounceTimeout !== null) {
      clearTimeout(debounceTimeout);
    }

    const newTimeout = setTimeout(() => {
      performSearch(value);
    }, 500);
    setDebounceTimeout(newTimeout);
  };

  useEffect(() => {
    performAPICall();
  }, []);

  useEffect(() => {
    fetchCart(token)
      .then((cartData) => generateCartItemsFrom(cartData, products))
      .then((items) => setItems(items));
  }, [products]);

  return (
    <div>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        {/* <Box display="flex" justifyContent="center" alignItems="center"> */}
        <TextField
          className="search-desktop"
          size="small"
          // fullWidth
          InputProps={{
            className: "search",
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          onChange={(e) => {
            debounceSearch(e, debounceTimeout);
          }}
        />
        {/* </Box> */}
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(e) => {
          debounceSearch(e, debounceTimeout);
        }}
      />
      <Grid container>
        <Grid container spacing={2} md={token ? 9 : 12}>
          <Grid item className="product-grid">
            <Box className="hero">
              <p className="hero-heading">
                India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                to your door step
              </p>
            </Box>
          </Grid>
          {loader === 200 && (
            <Box className="loading">
              <CircularProgress />
              <h4>Loading Products...</h4>
            </Box>
          )}
          {loader === 201 && (
            <>
              {filteredProducts.length ? (
                filteredProducts.map((product) => (
                  <Grid item xs={6} md={3} key={product["_id"]}>
                    <ProductCard
                      product={product}
                      handleAddToCart={async() => {    
                        await addToCart(token, items, product._id, products, 1,true);
                      }}
                    />
                  </Grid>
                ))
              ) : (
                <Box className="loading">
                  <SentimentDissatisfied color="action" />
                  <h4 style={{ color: "#636363" }}>No products found</h4>
                </Box>
              )}
            </>
          )}
        </Grid>
        {token ? (
          <Grid item xs={12} md={3} bgcolor="#E9F5E1">
            <Cart products={products} items={items} handleQuantity={addToCart}/>
          </Grid>
        ) : null}
      </Grid>
      <Footer />
    </div>
  );
};

export default Products;
