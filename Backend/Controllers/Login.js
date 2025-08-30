const Users = require("../Models/UserModel");
const jwt = require("jsonwebtoken");

exports.Login = async (req, res) => {
  let user = await Users.findOne({ email: req.body.email });

  // when we have user email id then we need to check if user emailId and password is correct or not
  if (user) {
    const passCompare = req.body.password === user.password;
    // if correct then genreated Json Web Token
    if (passCompare) {
      const data = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(data, "secret_ecom");
      res.json({ success: true, token });
    }
    // not correct then to show password is wrong
    else {
      res.status(400).json({
        success: false,
        errors: "Wrong Password",
      });
    }
  }
  // when this is not exist in our server then to show User not found
  else {
    res.status(400).json({
      success: false,
      errors: "User not found",
    });
  }
};
