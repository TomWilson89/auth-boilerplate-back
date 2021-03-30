import dotenv = require('dotenv');

dotenv.config();

export default {
  mongo: {
    MONGO_URI: process.env.MONGO_URI,
  },

  argon: {
    ARGON_LENGTH: process.env.ARGON_LENGTH,
    ARGON_TIME_COST: process.env.ARGON_TIME_COST,
    ARGON_PARALLELISM: process.env.ARGON_PARALLELISM,
  },

  jwt: {
    SECRET: process.env.JWT_SECRET,
    EXPIRES: process.env.JWT_EXPIRES,
    activation: {
      SECRET: process.env.JWT_ACTIVATION_SECRET,
      EXPIRES: process.env.JWT_ACTIVATION_EXPIRES,
    },
  },

  crypto: {
    ALGORITHM: process.env.TOKEN_ALGORITHM,
  },

  mail: {
    API_KEY: process.env.SENDGRID_API_KEY,
    SENDER: process.env.SENDER_EMAIL,
    NAME: process.env.SENDER_NAME,
  },

  client: {
    URL: process.env.CLIENT_URL,
  },

  google: {
    CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  },
};
