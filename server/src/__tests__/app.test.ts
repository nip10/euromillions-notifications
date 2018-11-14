import request from 'supertest';
import app from './../app';
import mongoose, { mongooseOptions, dburl } from './../services/db';
import logger from './../utils/logger';

beforeAll(async (done) => {
  // Setup MongoDB
  try {
    // Start MongoDB
    await mongoose.connect(dburl, mongooseOptions);
    logger.info('Connected to database.');
    // TODO: Clear all collections
    done();
  } catch (err) {
    logger.error(`Connection to the database failed. Details: ${err}`);
    process.exit(1);
  }
});

afterAll((done) => {
  // Stop MongoDB
  mongoose.connection.close(() => {
    logger.info('Closed mongoose connection');
    done();
  });
});

describe('GET /', () => {
  it('should respond with Hello', async (done) => {
    const res = await request(app).get('/api');
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Hello');
    done();
  });
});

describe('POST /createnotification', () => {
  it('should create a notification', async (done) => {
    const notificationObj = {
      email: 'john@mail.com',
      minprize: 100,
    }
    const res = await request(app).post('/api/createnotification')
      .send(notificationObj)
      .set('Accept', 'application/json')
    expect(res).toBeDefined();
    expect(res.status).toBe(201);
    done();
  });
});



