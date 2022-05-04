require("dotenv").config();

const URL =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;
const PORT = process.env.PORT || 3001;

module.exports = { URL, PORT };
