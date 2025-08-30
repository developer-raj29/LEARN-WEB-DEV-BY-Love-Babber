const Product = require("../Models/ProductModel");

exports.PopularInWomen = async (req, res) => {
  let products = await Product.find({ category: "women" });

  let popularinwomen = products.slice(0, 4);
  console.log("Popular in Women Fetched");

  res.send(popularinwomen);
};
