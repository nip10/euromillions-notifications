import express from 'express';
import {
  sayHello,
  createNotification,
  sendEditNotificationEmail,
  editNotification,
  sendDeleteNotificationEmail,
  deleteNotification
} from '../controllers/notification';
import {
  validateEmail,
  validateCreateNotification,
  validateEditNotificationRequest,
  validateEditNotification,
  validateDeleteNotification,
} from '../middleware/validation';

const router = express.Router();

router.get('/', sayHello);
router.post('/createnotification', validateCreateNotification, createNotification);
router.post('/editnotification', validateEditNotificationRequest, sendEditNotificationEmail);
router.get('/editnotification/:token/:minPrize', validateEditNotification, editNotification);
router.post('/deletenotification', validateEmail, sendDeleteNotificationEmail);
router.get('/deletenotification/:token', validateDeleteNotification, deleteNotification);

export default router;