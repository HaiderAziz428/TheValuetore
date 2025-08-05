const withImages = require("next-images");
const withNextCircularDeps = require("next-circular-dependency");
module.exports = {
  images: {
    domains: [
      "the-value-store-backend-production.up.railway.app",
      "localhost",
      // add more domains here if needed
    ],
  },
};
