import dotenv from "dotenv";
import mongoose from "mongoose";
import Bluebird from "bluebird";
import _ from "lodash";

import logger from "../utils/logger";

dotenv.config();

const { NODE_ENV, MONGODB_URI, MONGODB_URI_TEST } = process.env;

const isTest = NODE_ENV === "test";

if (!isTest && _.isNil(MONGODB_URI)) {
  logger.error("You need to set a MONGODB_URI in the .env file");
  process.exit(1);
}

if (isTest && _.isNil(MONGODB_URI_TEST)) {
  logger.error("You need to set a MONGODB_URI_TEST in the .env file");
  process.exit(1);
}

const dbUrl = isTest ? MONGODB_URI_TEST : MONGODB_URI;

(mongoose as any).Promise = Bluebird;

const mongooseOptions = {
  reconnectTries: 10,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// This needs to be set to avoid the deprecation warning. It'll probably be fixed in a future mongoose release,
// but for now, I need to set it manually
// (node:13160) DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
mongoose.set("useCreateIndex", true);

// Don't start MongoDB if we are in test mode.
if (NODE_ENV !== "test") {
  mongoose
    .connect(dbUrl, mongooseOptions)
    .then(() => {
      logger.info("Connected to database.");
    })
    .catch((err: any) => {
      logger.error(`Connection to the database failed. Details: ${err}`);
      process.exit(1);
    });
}

export { mongooseOptions, dbUrl };
export default mongoose;
