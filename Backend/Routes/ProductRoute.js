const express = require("express");

const router = express.Router();
const fetchUser = require("../Models/fetchUser");

//  handlers
const { addProduct } = require("../Controllers/AddProduct");
const { removeproduct } = require("../Controllers/RemoveProduct");
const { signup } = require("../Controllers/SignUp");
const { login } = require("../Controllers/Login");
const { newcollection } = require("../Controllers/NewCollection");
const { popularinwomen } = require("../Controllers/PopularInWomen");
const { addtocart } = require("../Controllers/AddToCart");
const { removeFromcart } = require("../Controllers/RemoveFromCart");
const { getcart } = require("../Controllers/GetCart");
const { allproducts } = require("../Controllers/AllProducts");

// api routes
router.get("/", allproducts);
router.post("/addproduct", addProduct);
router.post("/removeproduct", removeproduct);
router.post("/signup", signup);
router.post("/login", login);
router.get("/newcollection", newcollection);
router.get("/popularinwomen", popularinwomen);
router.post("/addtocart", fetchUser, addtocart);
router.post("/removeFromcart", fetchUser, removeFromcart);
router.post("/getcart", fetchUser, getcart);

module.exports = router;
