import Joi from "joi";
import _ from "lodash";
import { Request, Response, NextFunction } from "express";
import { VALIDATION, PRIZE } from "./../utils/constants";

export function validateEmailAndMinprize(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, minPrize } = req.body;

  const schema = Joi.object({
    email: Joi.string().email().required(),
    minPrize: Joi.number().integer().min(PRIZE.MIN).max(PRIZE.MAX).required(),
  });

  const { error, value } = schema.validate({ email, minPrize });

  if (error) {
    if (error.details[0].path[0] === "email") {
      res
        .status(400)
        .json({ error: VALIDATION.EMAIL_INVALID({ email: value.email }) });
    } else if (error.details[0].path[0] === "minPrize") {
      return res.status(400).json({ error: VALIDATION.MINPRIZE_INVALID });
    }
  } else {
    // Send the notification object to the next middleware
    res.locals.notificationObj = { email, minPrize };
    next();
  }
}

export function validateEmail(req: Request, res: Response, next: NextFunction) {
  const { email } = req.body;

  const schema = Joi.string().email().required();

  const { error, value } = schema.validate(email);

  if (error) {
    return res
      .status(400)
      .json({ error: VALIDATION.EMAIL_INVALID({ email: value }) });
  } else {
    // Send the notification object to the next middleware
    res.locals.email = email;
    next();
  }
}

export function validateTokenAndMinprize(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { token, minPrize } = req.body;

  const schema = Joi.object({
    token: Joi.string().required(),
    minPrize: Joi.number().integer().min(PRIZE.MIN).max(PRIZE.MAX).required(),
  });

  const { error, value } = schema.validate({ token, minPrize });

  if (error) {
    if (error.details[0].path[0] === "token") {
      return res.status(400).json({ error: VALIDATION.TOKEN_INVALID });
    } else if (error.details[0].path[0] === "minPrize") {
      return res.status(400).json({ error: VALIDATION.MINPRIZE_INVALID });
    }
  } else {
    // Send the edit notification object to the next middleware
    res.locals.editNotificationObj = { token, minPrize };
    next();
  }
}

export function validateToken(req: Request, res: Response, next: NextFunction) {
  const { token } = req.body;

  const schema = Joi.string().required();

  const { error, value } = schema.validate(token);

  if (error) {
    return res.status(400).json({ error: VALIDATION.TOKEN_INVALID });
  } else {
    // Send the edit notification object to the next middleware
    res.locals.deleteNotificationObj = { token };
    next();
  }
}
