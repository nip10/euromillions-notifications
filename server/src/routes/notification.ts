import express from "express";
import {
  sayHello,
  createNotification,
  sendEditNotificationEmail,
  sendDeleteNotificationEmail,
  editNotification,
  deleteNotification,
} from "../controllers/notification";
import {
  validateEmail,
  validateEmailAndMinprize,
  validateTokenAndMinprize,
  validateToken,
} from "../middleware/validation";

const router = express.Router();

router.get("/", sayHello);
// Request new notification
// Expects email and minPrize
// Sends a welcome email
router.post(
  "/createnotification",
  validateEmailAndMinprize,
  createNotification
);
// Request edit notification
// Expects email and minPrize
// Sends an email with a link for the confirmation page (client-side)
router.post(
  "/editnotification/request",
  validateEmailAndMinprize,
  sendEditNotificationEmail
);
// Actually edit the notification
// Expects token and minPrize
router.patch(
  "/editnotification/confirm",
  validateTokenAndMinprize,
  editNotification
);
// Request delete notification
// Expects email
// Sends an email (with an url for the update route) and returns 200 on success.
router.post(
  "/deletenotification/request",
  validateEmail,
  sendDeleteNotificationEmail
);
// Actually delete the notification
// Expects token
router.delete("/deletenotification/confirm", validateToken, deleteNotification);

export default router;
