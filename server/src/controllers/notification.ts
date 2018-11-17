import _ from 'lodash';
import uuidv4 from 'uuid/v4';
import { Request, Response } from 'express';
import Notification, { INotificationDocument } from '../models/notification';
import { sendWelcomeEmail } from '../services/mail';
import { ERROR, VALIDATION } from './../utils/constants';

export function sayHello(req: Request, res: Response) {
  return res.json({ message: 'Hello' });
}

export async function createNotification(req: Request, res: Response) {
  // Get the notificationObj from the previous middleware
  const { notificationObj }: {notificationObj: INotificationDocument} = res.locals;
  try {
    await Notification.create(notificationObj);
    res.sendStatus(201);
    // No 'return' here because we still need to send the email later
  } catch (e) {
    if (e.code === 11000) {
      return res.status(400).json({ error: ERROR.EMAIL_DUPLICATE });
    } else {
      return res.status(500).json({ error: ERROR.SERVER });
    }
  }
  try {
    await sendWelcomeEmail(notificationObj.email, { minPrize: notificationObj.minPrize });
  } catch (e) {
    return res.status(500).json({ error: ERROR.EMAIL_SEND });
  }
}

export async function sendEditNotificationEmail(req: Request, res: Response) {
  // Get the email from the previous middleware
  const { email } = res.locals;
  // Generate a new token
  const dt = new Date();
  dt.setDate(dt.getDate() + 1);
  const token = {
    value: uuidv4(),
    expiresAt: dt,
  }
  try {
    // Update the user document with new token
    await Notification.updateOne({ email }, { token });
    // TODO: Send an "edit" email with the token
    return res.sendStatus(200);
  } catch (e) {
    return res.status(500).json({ error: ERROR.SERVER });
  }
}

export async function editNotification(req: Request, res: Response) {
  const { token, minPrize } = res.locals.editNotificationObj;
  let notificationObj;
  try {
    // Check if token is associated with an account
    notificationObj = await Notification.findOne({ 'token.value': token });
    if (_.isNil(notificationObj)) {
      throw new Error();
    }
  } catch (e) {
    return res.status(400).json({ error: VALIDATION.TOKEN_INVALID });
  }
  const dt = new Date();
  dt.setDate(dt.getDate() + 1);
  // Check if token has expired
  if (notificationObj.token.expiresAt.getDate() < dt.getDate()) {
    return res.status(400).json({ error: ERROR.TOKEN_EXPIRED });
  }
  // Update minPrize and remove token
  try {
    await Notification.updateOne({ email: notificationObj.email }, { minPrize, token: null });
    return res.sendStatus(200);
  } catch (e) {
    return res.status(500).json({ error: ERROR.SERVER });
  }
}

export async function sendDeleteNotificationEmail(req: Request, res: Response) {
  // Get the email from the previous middleware
  const { email } = res.locals;
  // Generate a new token
  const dt = new Date();
  dt.setDate(dt.getDate() + 1);
  const token = {
    value: uuidv4(),
    expiresAt: dt,
  }
  try {
    // Update the user document with new token
    await Notification.updateOne({ email }, { token });
    // TODO: Send a "delete" email with the token
    return res.sendStatus(200);
  } catch (e) {
    return res.status(500).json({ error: ERROR.SERVER });
  }
}

export async function deleteNotification(req: Request, res: Response) {
  const { token } = res.locals.deleteNotificationObj;
  let notificationObj;
  try {
    // Check if token is associated with an account
    notificationObj = await Notification.findOne({ 'token.value': token });
    if (_.isNil(notificationObj)) {
      throw new Error();
    }
  } catch (e) {
    return res.status(400).json({ error: VALIDATION.TOKEN_INVALID });
  }
  const dt = new Date();
  dt.setDate(dt.getDate() + 1);
  // Check if token has expired
  if (notificationObj.token.expiresAt.getDate() < dt.getDate()) {
    return res.status(400).json({ error: ERROR.TOKEN_EXPIRED });
  }
  // Delete notification
  try {
    await Notification.deleteOne({ email: notificationObj.email });
    return res.sendStatus(200);
  } catch (e) {
    return res.status(500).json({ error: ERROR.SERVER });
  }
}
