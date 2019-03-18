import _ from "lodash";

export const TOKEN_DURATION_IN_DAYS = 1;

export const PRIZE = {
  MAX: 300,
  MIN: 15
};

export const URL = {
  INDEX: "https://em.diogocardoso.me",
  EDIT: _.template(
    "https://em.diogocardoso.me/editnotification/${token}/${minPrize}/"
  ),
  DELETE: _.template("https://em.diogocardoso.me/deletenotification/${token}")
};
export const ERROR = {
  SERVER: "Server error. Please try again later.",
  EMAIL_NOTFOUND: "Email is not subscribed.",
  EMAIL_DUPLICATE: "Email already registred.",
  EMAIL_SEND: "Unable to send email. Please try again later.",
  TOKEN_EXPIRED: "Token has expired."
};

export const VALIDATION = {
  EMAIL_INVALID: _.template("${email} is not a valid email address"),
  TOKEN_INVALID: "Invalid token.",
  MINPRIZE_INVALID: `Minprize is not a valid value. Please insert a number between ${
    PRIZE.MIN
  } and ${PRIZE.MAX}.`
};
