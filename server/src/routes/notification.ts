import express from 'express';
import {
  sayHello,
  createNotification,
  sendEditNotificationEmail,
  editNotification,
  sendDeleteNotificationEmail,
  deleteNotification } from '../controllers/notification';
import { validateNotification } from '../middleware/validation';

const router = express.Router();

router.get('/', sayHello);
router.post('/', validateNotification, createNotification);
router.post('/editnotification', sendEditNotificationEmail);
router.patch('/editnotification/:token', editNotification);
router.post('/deletenotification', sendDeleteNotificationEmail);
router.delete('/deletenotification/:token', deleteNotification);

export default router;