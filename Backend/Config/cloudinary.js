const cloudinary = require("cloudinary");

require("dotenv").config();

exports.cloudinaryConnect = () => {
  try {
    cloudinary.config({
      // cloud_name: "dzlccxjlh",
      // api_key: "443653692444348",
      // api_secret: "11VCcwIX-HWu-bxxcpLj-hJlLXo",
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
      secure: true,
    });
    console.log("Cloudinary connection successful");
  } catch (error) {
    console.error(error);
    console.log("Cloudinary connection failed");
  }
};
