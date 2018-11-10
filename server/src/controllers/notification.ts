import _ from 'lodash';
import uuidv4 from 'uuid/v4';
import { Request, Response } from 'express';
import Notification from '../models/notification';
import { sendWelcomeEmail } from '../services/mail';

export function sayHello(req: Request, res: Response) {
  res.json({ message: 'Hello' });
}

export async function createNotification(req: Request, res: Response) {
  // Get the notificationObj from the previous middleware
  const { notificationObj } = res.locals;
  const n = new Notification(notificationObj);
  try {
    await n.save();
    res.sendStatus(201);
  } catch (e) {
    if (e.code === 11000) {
      res.status(400).json({ error: 'Email already registred.' });
    } else {
      res.status(500).json({ error: 'Server error.' });
    }
  }
  try {
    await sendWelcomeEmail(notificationObj.email, { minPrize: notificationObj.minPrize });
  } catch (e) {
    res.status(500).json({ error: 'Unable to send email.' });
  }
}

export function sendEditNotificationEmail(req: Request, res: Response) {
  // Get the email from the previous middleware
  const { email } = res.locals;
  // Generate a temporary token
  const token = uuidv4();
  // Save it to the database

  // Send an email with the token
}

export function editNotification(req: Request, res: Response) {
  console.log('TODO');
}

export function sendDeleteNotificationEmail(req: Request, res: Response) {
  console.log('TODO');
}

export function deleteNotification(req: Request, res: Response) {
  console.log('TODO');
}

