const Users = require("../Models/UserModel");
const fetchUser = require("../Models/fetchUser");

(exports.GetCart = fetchUser),
  async (req, res) => {
    console.log("get cart");

    let userData = await Users.findOne({ _id: req.user.id });
    res.json(userData.cartData);
  };

// module.exports = GetCart;
