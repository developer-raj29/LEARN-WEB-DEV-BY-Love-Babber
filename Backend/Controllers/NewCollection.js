const Product = require("../Models/ProductModel");

exports.NewCollection = async (req, res) => {
  let products = await Product.find({});

  let newcollection = products.slice(1).slice(-8);
  console.log("NewCollection Fetched");

  res.send(newcollection);
};
