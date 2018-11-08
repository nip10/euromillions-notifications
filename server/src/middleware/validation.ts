import Joi from 'joi';
import _ from 'lodash';
import { Request, Response, NextFunction } from 'express';

export function validateCreateNotification(req: Request, res: Response, next: NextFunction) {
  const { email } = req.body;
  const minPrize = Number.parseInt(req.body.minprize, 10);

  const notificationObj = { email, minPrize };

  const schema = {
    email: Joi.string().email().required(),
    minPrize: Joi.number().integer().min(15).max(300).required(),
  };

  const validationResult = Joi.validate(notificationObj, schema);

  if (validationResult.error) {
    console.log('validation: ', validationResult.error);
    res.status(400).json({ error: validationResult.error });
  } else {
    // Send the notification object to the next middleware
    res.locals.notificationObj = notificationObj;
    next();
  }
};

export function validateEmail(req: Request, res: Response, next: NextFunction) {
  const { email } = req.body;
  const schema = Joi.string().email().required();
  const validationResult = Joi.validate({ email }, schema);
  if (validationResult.error) {
    console.log('validation: ', validationResult.error);
    res.status(400).json({ error: validationResult.error });
  } else {
    // Send the notification object to the next middleware
    res.locals.email = email;
    next();
  }
};