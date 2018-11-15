import request from 'supertest';
import app from './../app';
import Notification from './../models/notification';
import { setupDb, stopDb, fakeNotifications } from '../utils/test_db_setup';

beforeAll(async (done) => {
  await setupDb();
  done();
});

afterAll(async (done) => {
  await stopDb();
  done();
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
      .set('Accept', 'application/json');
    expect(res).toBeDefined();
    expect(res.status).toBe(201);
    done();
    // TODO: Add a Sinon spy on the sendWelcomeEmail function ?
  });
  it('should respond with 400 and a validation error when the email is invalid', async (done) => {
    const notificationObj = {
      email: 'not_a_valid_email',
      minprize: 100,
    }
    const res = await request(app).post('/api/createnotification')
      .send(notificationObj)
      .set('Accept', 'application/json');
    expect(res).toBeDefined();
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
    // expect(res.body.error).toBe(ERROR CONSTANT);
    done();
  });
  it('should respond with 400 and a validation error when the minprize is invalid', async (done) => {
    const notificationObj = {
      email: 'john@mail.com',
      minprize: 'not_a_valid_minprize',
    }
    const res = await request(app).post('/api/createnotification')
      .send(notificationObj)
      .set('Accept', 'application/json');
    expect(res).toBeDefined();
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
    // expect(res.body.error).toBe(ERROR CONSTANT);
    done();
  });
  it('should respond with 400 and an error if the email is already registred', async (done) => {
    const notificationObj = fakeNotifications[1];
    const res = await request(app).post('/api/createnotification')
      .send(notificationObj)
      .set('Accept', 'application/json');
    expect(res).toBeDefined();
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
    // expect(res.body.error).toBe(ERROR CONSTANT);
    done();
  });
});

describe('POST /editnotification', () => {
  it('should create a token, save it to the db, and send an email, for editing a notification', async (done) => {
    const email = fakeNotifications[1].email;
    const res = await request(app).post('/api/editnotification')
      .send({ email })
      .set('Accept', 'application/json');
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    // Check if the token was saved
    const user = await Notification.findOne({ email });
    expect(user).toBeDefined();
    expect(user).toHaveProperty('token.value');
    expect(user.token.value.length).toBeGreaterThan(10);
    expect(user).toHaveProperty('token.expiresAt');
    expect(Object.prototype.toString.call(user.token.expiresAt)).toBe('[object Date]');
    // TODO: Add a Sinon spy on the sendEmail function ?
    done();
  });
  it('should respond with 400 and a validation error when email is invalid', async (done) => {
    const email = 'not_a_valid_email';
    const res = await request(app).post('/api/editnotification')
      .send({ email })
      .set('Accept', 'application/json');
    expect(res).toBeDefined();
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
    // expect(res.body.error).toBe(ERROR CONSTANT);
    done();
  });
});

describe('PATCH /editnotification', () => {
  it('should update the minprize', async (done) => {
    const token = fakeNotifications[0].token.value;
    const minprize = 123;
    const res = await request(app)
      .patch('/api/editnotification')
      .send({ token, minprize })
      .set('Accept', 'application/json');
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    done();
  });
  it('should respond with 400 and a validation error when token is invalid', async (done) => {
    const token: null = null;
    const minprize = 123;
    const res = await request(app)
      .patch('/api/editnotification')
      .send({ token, minprize })
      .set('Accept', 'application/json');
    expect(res).toBeDefined();
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
    // expect(res.body.error).toBe(ERROR CONSTANT);
    done();
  });
  it('should respond with 400 and a validation error when minprize is invalid', async (done) => {
    const token = fakeNotifications[0].token.value;
    const minprize = 'not_a_valid_minprize';
    const res = await request(app)
      .patch('/api/editnotification')
      .send({ token, minprize })
      .set('Accept', 'application/json');
    expect(res).toBeDefined();
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
    // expect(res.body.error).toBe(ERROR CONSTANT);
    done();
  });
  it('should respond with 400 and an error when the token is invalid (doesnt exits)', async (done) => {
    const token = 'not_the_real_token';
    const minprize = 123;
    const res = await request(app)
      .patch('/api/editnotification')
      .send({ token, minprize })
      .set('Accept', 'application/json');
    expect(res).toBeDefined();
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
    // expect(res.body.error).toBe(ERROR CONSTANT);
    done();
  });
  // it('should respond with 400 and an error when the token is invalid (expired)', (done) => {
  //   done();
  // });
});

describe('POST /deletenotification', () => {
  it('should create a token, save it to the db, and send an email, for deleting a notification', async (done) => {
    const email = fakeNotifications[2].email;
    const res = await request(app).post('/api/deletenotification')
      .send({ email })
      .set('Accept', 'application/json');
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    // Check if there's actually a token associated with the email
    const user = await Notification.findOne({ email });
    expect(user).toBeDefined();
    expect(user).toHaveProperty('token.value');
    expect(user.token.value.length).toBeGreaterThan(10);
    expect(user).toHaveProperty('token.expiresAt');
    expect(Object.prototype.toString.call(user.token.expiresAt)).toBe('[object Date]');
    // TODO: Add a Sinon spy on the sendEmail function ?
    done();
  });
  it('validation: should respond with 400 and a validation error when email is invalid', async (done) => {
    const email = 'not_a_valid_email';
    const res = await request(app).post('/api/deletenotification')
      .send({ email })
      .set('Accept', 'application/json');
    expect(res).toBeDefined();
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
    // expect(res.body.error).toBe(ERROR CONSTANT);
    done();
  });
});

describe('DELETE /deletenotification/:token', () => {
  it('should delete a notification', async (done) => {
    const token = fakeNotifications[3].token.value;
    const res = await request(app)
      .delete(`/api/deletenotification/${token}`)
      .set('Accept', 'application/json');
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    done();
  });
  it('should respond with 400 and a validation error when token is invalid', async (done) => {
    const token: null = null;
    const res = await request(app)
      .delete(`/api/deletenotification/${token}`)
      .set('Accept', 'application/json');
    expect(res).toBeDefined();
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
    // expect(res.body.error).toBe(ERROR CONSTANT);
    done();
  });
  it('should respond with 400 and an error when the token is invalid (doesnt exits)', async (done) => {
    const token = 'not_the_real_token';
    const res = await request(app)
      .delete(`/api/deletenotification/${token}`)
      .set('Accept', 'application/json');
    expect(res).toBeDefined();
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
    // expect(res.body.error).toBe(ERROR CONSTANT);
    done();
  });
  // it('should respond with 400 and an error when the token is invalid (expired)', (done) => {
  //   done();
  // });
});