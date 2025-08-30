const Users = require("../Models/UserModel");
const fetchUser = require("../Models/fetchUser");

(exports.RemoveFromCart = fetchUser),
  async (req, res) => {
    // let user = await Users.findOne({ email: req.body.email });
    // let product = await Product.findOne({ id: req.body.id });

    console.log(req.body, req.user);

    let userData = await Users.findOne({ _id: req.user.id });
    if (userData.cartData[req.body.itemId] > 0)
      userData.cartData[req.body.itemId] -= 1;
    await Users.findOneAndUpdate(
      { _id: req.user.id },
      { cartData: userData.cartData }
    );
    res.send("Removed product");
  };

// module.exports = RemoveFromCart;
