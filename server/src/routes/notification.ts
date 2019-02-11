import express from "express";
import {
  sayHello,
  createNotification,
  sendEditNotificationEmail,
  editNotification,
  sendDeleteNotificationEmail,
  deleteNotification
} from "../controllers/notification";
import {
  validateEmail,
  validateCreateOrEditNotification,
  validateEditNotification,
  validateDeleteNotification
} from "../middleware/validation";

const router = express.Router();

router.get("/", sayHello);
router.post(
  "/createnotification",
  validateCreateOrEditNotification,
  createNotification
);
router.post(
  "/editnotification",
  validateCreateOrEditNotification,
  sendEditNotificationEmail
);
router.get(
  "/editnotification/:token/:minPrize",
  validateEditNotification,
  editNotification
);
router.post("/deletenotification", validateEmail, sendDeleteNotificationEmail);
router.get(
  "/deletenotification/:token",
  validateDeleteNotification,
  deleteNotification
);

export default router;
