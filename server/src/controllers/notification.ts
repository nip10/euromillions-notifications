import _ from "lodash";
import { Request, Response } from "express";
import Notification, { INotificationDocument } from "../models/notification";
import {
  sendWelcomeEmail,
  sendDeleteEmail,
  sendEditEmail
} from "../services/mail";
import { ERROR, VALIDATION, TOKEN_DURATION_IN_DAYS } from "../utils/constants";
import { generateToken } from "../utils/misc";
import logger from "../utils/logger";

export function sayHello(req: Request, res: Response) {
  return res.json({ message: "Hello" });
}

export async function createNotification(req: Request, res: Response) {
  // Get the notificationObj from the previous middleware
  const {
    notificationObj
  }: { notificationObj: INotificationDocument } = res.locals;
  try {
    await Notification.create(notificationObj);
  } catch (e) {
    if (e.code === 11000) {
      return res.status(400).json({ error: ERROR.EMAIL_DUPLICATE });
    } else {
      return res.status(500).json({ error: ERROR.SERVER });
    }
  }
  try {
    await sendWelcomeEmail(notificationObj.email, {
      minPrize: notificationObj.minPrize
    });
    logger.info(
      `Created new notification. Details: ${notificationObj.email}, ${
        notificationObj.minPrize
      }M.`
    );
    res.sendStatus(201);
  } catch (e) {
    return res.status(500).json({ error: ERROR.EMAIL_SEND });
  }
}

export async function sendEditNotificationEmail(req: Request, res: Response) {
  // Get the email from the previous middleware
  const {
    email,
    minPrize
  }: { email: string; minPrize: number } = res.locals.notificationObj;
  // Generate a new token
  const token = generateToken();
  try {
    // Update the user document with new token
    await Notification.updateOne({ email }, { token });
  } catch (e) {
    return res.status(500).json({ error: ERROR.SERVER });
  }
  try {
    // Send email to user
    await sendEditEmail(email, { minPrize, token });
    return res.sendStatus(200);
  } catch (e) {
    return res.status(500).json({ error: ERROR.EMAIL_SEND });
  }
}

export async function editNotification(req: Request, res: Response) {
  // TODO: Create a token, save it to the user document, send an email with an url /editnotification/:token
  // This url is client-side, not the api. Try to edit the notification via componentdidmount and then show the result
  const {
    token,
    minPrize
  }: { token: string; minPrize: number } = res.locals.editNotificationObj;
  let notificationObj: INotificationDocument;
  try {
    // Check if token is associated with an account
    notificationObj = await Notification.findOne({ "token.value": token });
    if (_.isNil(notificationObj)) {
      throw new Error();
    }
  } catch (e) {
    return res.status(400).json({ error: VALIDATION.TOKEN_INVALID });
  }
  const dt = new Date();
  dt.setDate(dt.getDate() + TOKEN_DURATION_IN_DAYS);
  // Check if token has expired
  if (notificationObj.token.expiresAt.getDate() < dt.getDate()) {
    return res.status(400).json({ error: ERROR.TOKEN_EXPIRED });
  }
  // Update minPrize and remove token
  try {
    await Notification.updateOne(
      { email: notificationObj.email },
      { minPrize, token: null }
    );
    return res.sendStatus(200);
  } catch (e) {
    return res.status(500).json({ error: ERROR.SERVER });
  }
}

export async function sendDeleteNotificationEmail(req: Request, res: Response) {
  // Get the email from the previous middleware
  const { email }: { email: string } = res.locals;
  // Generate a new token
  const token = generateToken();
  try {
    // Update the user document with new token
    await Notification.updateOne({ email }, { token });
  } catch (e) {
    return res.status(500).json({ error: ERROR.SERVER });
  }
  try {
    // Send email to user
    await sendDeleteEmail(email, { token });
    return res.sendStatus(200);
  } catch (e) {
    return res.status(500).json({ error: ERROR.EMAIL_SEND });
  }
}

export async function deleteNotification(req: Request, res: Response) {
  const { token }: { token: string } = res.locals.deleteNotificationObj;
  let notificationObj: INotificationDocument;
  try {
    // Check if token is associated with an account
    notificationObj = await Notification.findOne({ "token.value": token });
    if (_.isNil(notificationObj)) {
      throw new Error();
    }
  } catch (e) {
    return res.status(400).json({ error: VALIDATION.TOKEN_INVALID });
  }
  const dt = new Date();
  dt.setDate(dt.getDate() + TOKEN_DURATION_IN_DAYS);
  // Check if token has expired
  if (notificationObj.token.expiresAt.getDate() < dt.getDate()) {
    return res.status(400).json({ error: ERROR.TOKEN_EXPIRED });
  }
  // Delete notification
  try {
    await Notification.deleteOne({ email: notificationObj.email });
    logger.info(`Deleted new notification. Details: ${notificationObj.email}.`);
    return res.sendStatus(200);
  } catch (e) {
    return res.status(500).json({ error: ERROR.SERVER });
  }
}
