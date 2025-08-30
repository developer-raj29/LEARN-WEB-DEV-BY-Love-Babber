const mongoose = require("mongoose");

require("dotenv").config();

exports.connect = () => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(console.log("DB Successfully connected"))
    .catch((err) => {
      console.log("DB Connection Issues");
      console.log(err);
      process.exit(1);
    });
};
