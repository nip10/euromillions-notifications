import _ from 'lodash';

export const URL = {
  INDEX: _.template('https://p.dcdev.pt/euronotify'),
}

export const ERROR = {
  SERVER: 'Server error. Please try again later.',
  EMAIL_DUPLICATE: 'Email already registred.',
  EMAIL_SEND: 'Unable to send email. Please try again later.',
  TOKEN_EXPIRED: 'Token has expired.',
}

export const VALIDATION = {
  EMAIL_INVALID: _.template('${email} is not a valid email address'),
  TOKEN_INVALID: 'Invalid token.',
  MINPRIZE_INVALID: 'Minprize is not a valid value. Please insert a number between X and Y.',
}