const Product = require("../Models/ProductModel");

exports.RemoveProduct = async (req, res) => {
  try {
    await Product.findOneAndDelete({ id: req.body.id });
    console.log("Removed product");
    res.status(200).json({
      success: true,
      name: req.body.name,
      id: req.body.id,
      message: "Product removed successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      error: error,
      message: "Something went wrong",
    });
  }
};
