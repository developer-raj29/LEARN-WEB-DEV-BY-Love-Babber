const express = require("express");
const app = express();

// load .env configuration
require("dotenv").config();
const PORT = process.env.PORT || 5000;

// middleware for parse json responses
const fileupload = require("express-fileupload");
app.use(express.json());

app.use(
  fileupload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// DATABASE connetions with MongoDB
const DB = require("./Config/database");
DB.connect();

// import Cloudinary from 'cloudinary file and establish connection
const cloudinary = require("./Config/cloudinary");
cloudinary.cloudinaryConnect();

// import routes from Routes folder
const ProductRoutes = require("./Routes/ProductRoute");
app.use("/api/v1", ProductRoutes);

app.get("/", (req, res) => {
  res.send(`Express APP is Running PORT No. ${PORT} successfully`);
});

app.listen(PORT, (error) => {
  if (!error) {
    console.log("Server is running on port : " + PORT);
  } else {
    console.log("Error : " + error);
  }
});
