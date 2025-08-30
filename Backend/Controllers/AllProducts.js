const Product = require("../Models/ProductModel");

exports.AllProducts = async (req, res) => {
  let products = await Product.find({});

  res.status(200).json({
    success: true,
    data: products,
    message: "All Products Fetched Successfully",
  });
};

// module. = AllProducts ;
