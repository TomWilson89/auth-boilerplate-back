import dotenv = require('dotenv');

dotenv.config();

export default {
  mongo: {
    MONGO_URI: process.env.MONGO_URI,
  },
};
