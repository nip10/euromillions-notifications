import _ from 'lodash';
import uuidv4 from 'uuid/v4';
import logger from "./logger";
import mongoose, { dbUrl, mongooseOptions } from "../services/db";
import Notification, { INotification } from '../models/notification';
import { TOKEN_DURATION_IN_DAYS } from '../utils/constants';

const startDb = async () => {
  try {
    await mongoose.connect(dbUrl, mongooseOptions);
    logger.info('Connected to database.');
  } catch (err) {
    logger.error(`Connection to the database failed. Details: ${err}`);
    process.exit(1);
  }
}

const cleanDb = async () => {
  try {
    // Clear collections
    await mongoose.connection.dropDatabase();
    logger.info('Removed old database.')
  } catch (err) {
    logger.error(`Couldn't remove collection. Details: ${err}`);
    process.exit(1);
  }
}

const createToken = (expired: boolean = false) => {
  const expiresAtInterval = expired ? -TOKEN_DURATION_IN_DAYS : TOKEN_DURATION_IN_DAYS;
  const dt = new Date();
  dt.setDate(dt.getDate() + expiresAtInterval);
  return {
    value: uuidv4(),
    expiresAt: dt,
  };
}

export const fakeNotifications: INotification[] = [
  {
    email: 'a@mail.com',
    minPrize: 50,
    token: createToken(),
  },
  {
    email: 'b@mail.com',
    minPrize: 100,
  },
  {
    email: 'c@mail.com',
    minPrize: 120,
  },
  {
    email: 'd@mail.com',
    minPrize: 150,
    token: createToken(),
  },
  {
    email: 'e@mail.com',
    minPrize: 80,
    token: createToken(true),
  },
];

const createFakeNotifications = async () => {
  try {
    // Since this is a new/clean db, we need to build the indexes.
    await Notification.init();
    await Notification.create(fakeNotifications);
    logger.info('Added fake notifications.');
  } catch (err) {
    logger.info(`Error adding fake notifications. Details: ${err}`);
  }
}

export async function setupDb() {
  await startDb();
  await cleanDb();
  await createFakeNotifications();
}

export async function stopDb() {
  await mongoose.connection.close();
  logger.info('Closed mongoose connection');
}