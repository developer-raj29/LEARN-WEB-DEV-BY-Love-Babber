const express = require("express");
const app = express();

// load config from .env file port or database
require("dotenv").config();

const PORT = process.env.PORT || 8000;

// middleware to parse json data to request body
app.use(express.json());

// import Router from route file
const Routes = require("./Router/Route");

// Mount the Routes
app.use("/api/v1", Routes);

// default routes to show our webpage
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// app.get("/register", (req, res) => {
//   res.send("Hello your are register user!");
// });

// Start Server Listener
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
