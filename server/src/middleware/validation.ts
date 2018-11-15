import Joi from 'joi';
import _ from 'lodash';
import { Request, Response, NextFunction } from 'express';

export function validateCreateNotification(req: Request, res: Response, next: NextFunction) {
  const { email } = req.body;
  const minPrize = Number.parseInt(req.body.minprize, 10);

  const schema = {
    email: Joi.string().email().required(),
    minPrize: Joi.number().integer().min(15).max(300).required(),
  };

  const { error, value } = Joi.validate({ email, minPrize }, schema);

  if (error) {
    res.status(400).json({ error: `${value} is not valid.` });
    // TODO: Add better validation errors since there are multiple params
  } else {
    // Send the notification object to the next middleware
    res.locals.notificationObj = { email, minPrize };
    next();
  }
};

export function validateEmail(req: Request, res: Response, next: NextFunction) {
  const { email } = req.body;

  const schema = Joi.string().email().required();

  const { error, value } = Joi.validate(email, schema);

  if (error) {
    res.status(400).json({ error: `${value} is not a valid email address.` });
  } else {
    // Send the notification object to the next middleware
    res.locals.email = email;
    next();
  }
};

export function validateEditNotification(req: Request, res: Response, next: NextFunction) {
  const { token } = req.body;
  const minPrize = Number.parseInt(req.body.minprize, 10);

  const schema = {
    token: Joi.string().required(),
    minPrize: Joi.number().integer().min(15).max(300).required()
  };

  const { error, value } = Joi.validate({ token, minPrize }, schema);

  if (error) {
    res.status(400).json({ error: `${value} is not valid.` });
    // TODO: Add better validation errors since there are multiple params
  } else {
    // Send the edit notification object to the next middleware
    res.locals.editNotificationObj = { token, minPrize };
    next();
  }
}

export function validateDeleteNotification(req: Request, res: Response, next: NextFunction) {
  const { token } = req.params;

  const schema = Joi.string().required();

  const { error, value } = Joi.validate(token, schema);

  if (error) {
    res.status(400).json({ error: `Invalid token ${value}` });
  } else {
    // Send the edit notification object to the next middleware
    res.locals.deleteNotificationObj = { token };
    next();
  }
}