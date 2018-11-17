import mongoose, { dbUrl, mongooseOptions } from "../services/db";
import logger from "./logger";
import Notification from './../models/notification';
import _ from 'lodash';
import uuidv4 from 'uuid/v4';

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

const createToken = () => {
  const dt = new Date();
  dt.setDate(dt.getDate() + 1);
  return {
    value: uuidv4(),
    expiresAt: dt,
  };
}

export const fakeNotifications = [
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
];

const createFakeNotifications = async () => {
  const fakeNotificationsObjArr = _.map(fakeNotifications, fakeNotification => {
    return new Notification(fakeNotification);
  });

  const promises = _.map(fakeNotificationsObjArr, fakeNotificationsObj => {
    return fakeNotificationsObj.save();
  });

  try {
    await Promise.all(promises);
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