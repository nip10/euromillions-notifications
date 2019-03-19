import dotenv from "dotenv";
import _ from "lodash";
import app from "./app";
import logger from "./utils/logger";

dotenv.config();

const {
  PORT,
  NODE_ENV,
  MONGODB_URI,
  EMAIL_SENDGRID_API_KEY,
  EMAIL_ADDRESS
} = process.env;
const PORT_N = Number.parseInt(PORT, 10);
const isProd = NODE_ENV === "production";

if (!_.isFinite(PORT_N)) {
  logger.error("You need to set a PORT in the .env file");
  process.exit(-1);
}

if (_.isNil(NODE_ENV) || !_.isString(NODE_ENV)) {
  logger.error("You need to set a NODE_ENV in the .env file");
  process.exit(-1);
}

if (!_.isString(MONGODB_URI)) {
  logger.error("You need to set a MONGODB_URI in the .env file");
  process.exit(-1);
}

if (isProd) {
  if (!_.isString(EMAIL_SENDGRID_API_KEY)) {
    logger.error("You need to set a MONGODB_URI in the .env file");
    process.exit(-1);
  }

  if (!_.isString(EMAIL_ADDRESS)) {
    logger.error("You need to set a MONGODB_URI in the .env file");
    process.exit(-1);
  }
}

// Start Express
app.listen(PORT_N, () => {
  logger.info(`Started on port ${PORT} in ${NODE_ENV} mode`);
});
