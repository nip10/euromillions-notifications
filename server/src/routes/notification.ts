import express from 'express';
import {
  sayHello,
  createNotification,
  sendEditNotificationEmail,
  editNotification,
  sendDeleteNotificationEmail,
  deleteNotification
} from '../controllers/notification';
import { validateCreateNotification, validateEmail } from '../middleware/validation';

const router = express.Router();

router.get('/', sayHello);
router.post('/', validateCreateNotification, createNotification);
router.post('/editnotification', validateEmail, sendEditNotificationEmail);
router.patch('/editnotification/:token', editNotification);
router.post('/deletenotification', sendDeleteNotificationEmail);
router.delete('/deletenotification/:token', deleteNotification);

export default router;