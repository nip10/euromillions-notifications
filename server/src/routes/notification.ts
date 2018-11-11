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
  validateEditNotification,
  validateDeleteNotification,
} from '../middleware/validation';

const router = express.Router();

router.get('/', sayHello);
router.post('/', validateCreateNotification, createNotification);
router.post('/editnotification', validateEmail, sendEditNotificationEmail);
router.patch('/editnotification/:token/:minprize', validateEditNotification, editNotification);
router.post('/deletenotification', validateEmail, sendDeleteNotificationEmail);
router.delete('/deletenotification/:token', validateDeleteNotification, deleteNotification);

export default router;