const Users = require("../Models/UserModel");
const fetchUser = require("../Models/fetchUser");

(exports.AddToCart = fetchUser),
  async (req, res) => {
    // let user = await Users.findOne({ email: req.body.email });
    // let product = await Product.findOne({ id: req.body.id });

    console.log(req.body, req.user);

    let userData = await Users.findOne({ _id: req.user.id });
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate(
      { _id: req.user.id },
      { cartData: userData.cartData }
    );
    res.send("Added product");
  };

// module.exports = AddToCart;
