const express = require("express");
const app = express();
const PORT = 9000;
const mongoose = require("mongoose");

const connect = () => {
  mongoose
    .connect("")
    .then("Database connect...")
    .catch("connection issue in DB....");
  process.exit(1);
};

connect();


app.get("/", (req, res) => {
  res.send(`Hello app is start port no ${PORT}`);
});

app.listen(PORT, () => {
  console.log("Server start...");
});
