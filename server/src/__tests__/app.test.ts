import request from "supertest";
import app from "./../app";
import Notification, { INotification } from "./../models/notification";
import { setupDb, stopDb, fakeNotifications } from "../utils/test_db_setup";
import { ERROR, VALIDATION, PRIZE } from "./../utils/constants";

beforeAll(async (done) => {
  await setupDb();
  done();
});

afterAll(async (done) => {
  await stopDb();
  done();
});

describe("GET /", () => {
  it("should respond with Hello", async (done) => {
    const res = await request(app).get("/");
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Hello");
    done();
  });
});

describe("POST /createnotification", () => {
  it("should create a notification", async (done) => {
    const notificationObj: INotification = {
      email: "john@mail.com",
      minPrize: 100,
    };
    const res = await request(app)
      .post("/createnotification")
      .send(notificationObj)
      .set("Accept", "application/json");
    expect(res).toBeDefined();
    expect(res.status).toBe(201);
    done();
  });
  it("should respond with 400 and a validation error when the email is invalid", async (done) => {
    const notificationObj = {
      email: "not_a_valid_email",
      minPrize: 100,
    };
    const res = await request(app)
      .post("/createnotification")
      .send(notificationObj)
      .set("Accept", "application/json");
    expect(res).toBeDefined();
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
    expect(res.body.error).toBe(
      VALIDATION.EMAIL_INVALID({ email: notificationObj.email })
    );
    done();
  });
  it("should respond with 400 and a validation error when the minPrize is invalid", async (done) => {
    const notificationObj = {
      email: "john@mail.com",
      minPrize: "not_a_valid_minprize",
    };
    const res = await request(app)
      .post("/createnotification")
      .send(notificationObj)
      .set("Accept", "application/json");
    expect(res).toBeDefined();
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
    expect(res.body.error).toBe(VALIDATION.MINPRIZE_INVALID);
    done();
  });
  it("should respond with 400 and an error if the email is already registred", async (done) => {
    const notificationObj = fakeNotifications[1];
    const res = await request(app)
      .post("/createnotification")
      .send(notificationObj)
      .set("Accept", "application/json");
    expect(res).toBeDefined();
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
    expect(res.body.error).toBe(ERROR.EMAIL_DUPLICATE);
    done();
  });
});

describe("POST /editnotification/request", () => {
  it("should create a token, save it to the db, and send an email, for editing a notification", async (done) => {
    const email = fakeNotifications[1].email;
    const minPrize = 100;
    const res = await request(app)
      .post("/editnotification/request")
      .send({ email, minPrize })
      .set("Accept", "application/json");
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    // Check if the token was saved
    const user = await Notification.findOne({ email });
    expect(user).toBeDefined();
    expect(user).toHaveProperty("token.value");
    expect(user.token.value.length).toBeGreaterThan(10);
    expect(user).toHaveProperty("token.expiresAt");
    expect(Object.prototype.toString.call(user.token.expiresAt)).toBe(
      "[object Date]"
    );
    done();
  });
  it("should respond with 400 and a validation error when email is invalid", async (done) => {
    const email = "not_a_valid_email";
    const minPrize = 100;
    const res = await request(app)
      .post("/editnotification/request")
      .send({ email, minPrize })
      .set("Accept", "application/json");
    expect(res).toBeDefined();
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
    expect(res.body.error).toBe(VALIDATION.EMAIL_INVALID({ email }));
    done();
  });
  it("should respond with 400 and a validation error when email does not exist", async (done) => {
    const email = "validEmail@butDoesntExist.com";
    const minPrize = 100;
    const res = await request(app)
      .post("/editnotification/request")
      .send({ email, minPrize })
      .set("Accept", "application/json");
    expect(res).toBeDefined();
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
    expect(res.body.error).toBe(ERROR.EMAIL_NOTFOUND);
    done();
  });
  it("should respond with 400 and a validation error when minPrize is above max", async (done) => {
    const email = "validEmail@mail.com";
    const minPrize = PRIZE.MAX + 10;
    const res = await request(app)
      .post("/editnotification/request")
      .send({ email, minPrize })
      .set("Accept", "application/json");
    expect(res).toBeDefined();
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
    expect(res.body.error).toBe(VALIDATION.MINPRIZE_INVALID);
    done();
  });
  it("should respond with 400 and a validation error when minPrize is below min", async (done) => {
    const email = "validEmail@mail.com";
    const minPrize = PRIZE.MIN - 10;
    const res = await request(app)
      .post("/editnotification/request")
      .send({ email, minPrize })
      .set("Accept", "application/json");
    expect(res).toBeDefined();
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
    expect(res.body.error).toBe(VALIDATION.MINPRIZE_INVALID);
    done();
  });
});

describe("PATCH /editnotification/confirm", () => {
  it("should update the minPrize", async (done) => {
    const token = fakeNotifications[0].token.value;
    const minPrize = 123;
    const res = await request(app)
      .patch("/editnotification/confirm")
      .send({ token, minPrize })
      .set("Accept", "application/json");
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    done();
  });
  it("should respond with 400 and a validation error when token is invalid", async (done) => {
    const token: null = null;
    const minPrize = 123;
    const res = await request(app)
      .patch("/editnotification/confirm")
      .send({ token, minPrize })
      .set("Accept", "application/json");
    expect(res).toBeDefined();
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
    expect(res.body.error).toBe(VALIDATION.TOKEN_INVALID);
    done();
  });
  it("should respond with 400 and a validation error when minPrize is invalid", async (done) => {
    const token = fakeNotifications[0].token.value;
    const minPrize = "not_a_valid_minprize";
    const res = await request(app)
      .patch("/editnotification/confirm")
      .send({ token, minPrize })
      .set("Accept", "application/json");
    expect(res).toBeDefined();
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
    expect(res.body.error).toBe(VALIDATION.MINPRIZE_INVALID);
    done();
  });
  it("should respond with 400 and an error when the token is invalid (doesnt exits)", async (done) => {
    const token = "not_the_real_token";
    const minPrize = 123;
    const res = await request(app)
      .patch("/editnotification/confirm")
      .send({ token, minPrize })
      .set("Accept", "application/json");
    expect(res).toBeDefined();
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
    expect(res.body.error).toBe(VALIDATION.TOKEN_INVALID);
    done();
  });
  it("should respond with 400 and an error when the token is invalid (expired)", async (done) => {
    const token = fakeNotifications[4].token.value;
    const minPrize = 100;
    const res = await request(app)
      .patch("/editnotification/confirm")
      .send({ token, minPrize })
      .set("Accept", "application/json");
    expect(res).toBeDefined();
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
    expect(res.body.error).toBe(ERROR.TOKEN_EXPIRED);
    done();
  });
});

describe("POST /deletenotification/request", () => {
  it("should create a token, save it to the db, and send an email, for deleting a notification", async (done) => {
    const email = fakeNotifications[2].email;
    const res = await request(app)
      .post("/deletenotification/request")
      .send({ email })
      .set("Accept", "application/json");
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    // Check if there's actually a token associated with the email
    const user = await Notification.findOne({ email });
    expect(user).toBeDefined();
    expect(user).toHaveProperty("token.value");
    expect(user.token.value.length).toBeGreaterThan(10);
    expect(user).toHaveProperty("token.expiresAt");
    expect(Object.prototype.toString.call(user.token.expiresAt)).toBe(
      "[object Date]"
    );
    done();
  });
  it("validation: should respond with 400 and a validation error when email is invalid", async (done) => {
    const email = "not_a_valid_email";
    const res = await request(app)
      .post("/deletenotification/request")
      .send({ email })
      .set("Accept", "application/json");
    expect(res).toBeDefined();
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
    expect(res.body.error).toBe(VALIDATION.EMAIL_INVALID({ email }));
    done();
  });
  it("validation: should respond with 400 and a validation error when email doesnt exist", async (done) => {
    const email = "validEmail@butDoesntExist.com";
    const res = await request(app)
      .post("/deletenotification/request")
      .send({ email })
      .set("Accept", "application/json");
    expect(res).toBeDefined();
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
    expect(res.body.error).toBe(ERROR.EMAIL_NOTFOUND);
    done();
  });
});

describe("DELETE /deletenotification/confirm", () => {
  it("should delete a notification", async (done) => {
    const token = fakeNotifications[3].token.value;
    const res = await request(app)
      .delete("/deletenotification/confirm")
      .send({ token })
      .set("Accept", "application/json");
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    done();
  });
  it("should respond with 400 and a validation error when token is invalid", async (done) => {
    const token: null = null;
    const res = await request(app)
      .delete("/deletenotification/confirm")
      .send({ token })
      .set("Accept", "application/json");
    expect(res).toBeDefined();
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
    expect(res.body.error).toBe(VALIDATION.TOKEN_INVALID);
    done();
  });
  it("should respond with 400 and an error when the token is invalid (doesnt exist)", async (done) => {
    const token = "not_the_real_token";
    const res = await request(app)
      .delete("/deletenotification/confirm")
      .send({ token })
      .set("Accept", "application/json");
    expect(res).toBeDefined();
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
    expect(res.body.error).toBe(VALIDATION.TOKEN_INVALID);
    done();
  });
  it("should respond with 400 and an error when the token is invalid (expired)", async (done) => {
    const token = fakeNotifications[4].token.value;
    const res = await request(app)
      .delete("/deletenotification/confirm")
      .send({ token })
      .set("Accept", "application/json");
    expect(res).toBeDefined();
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
    expect(res.body.error).toBe(ERROR.TOKEN_EXPIRED);
    done();
  });
});
