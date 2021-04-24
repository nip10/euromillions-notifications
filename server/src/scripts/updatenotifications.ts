import { CronJob } from "cron";
import axios, { AxiosResponse } from "axios";
import { parseString } from "xml2js";
import Notification from "../models/notification";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import logger from "../utils/logger";
import { URL } from "../utils/constants";

dotenv.config({ path: "../.env" });
const { EMAIL_SENDGRID_API_KEY, EMAIL_ADDRESS } = process.env;

sgMail.setApiKey(EMAIL_SENDGRID_API_KEY);

interface IEmail {
  email: string;
}

function getPrizeFromXml(xml: string) {
  return new Promise((resolve, reject) => {
    parseString(xml, (err: any, result: any) => {
      if (err) {
        return reject("Invalid XML document.");
      }
      const data = result.rss.channel[0].item[0].description[0];
      const beginIndex = data.indexOf(";");
      const endIndex = data.indexOf(".");
      const prize = data.substring(beginIndex + 1, endIndex);
      const prizeNum = Number.parseInt(prize, 10);
      logger.info(`Current prize is ${prizeNum}€`);
      return resolve(prizeNum);
    });
  });
}

async function getEmailsWithMinprize(currentPrize: number) {
  const emails = await Notification.find(
    { minPrize: { $lte: currentPrize } },
    "email"
  );
  return emails;
}

async function sendEmails(emails: IEmail[], currentPrize: number) {
  logger.info(`Sending emails to ${emails}`);
  const msg = {
    to: emails.map((email) => email.email),
    from: EMAIL_ADDRESS,
    templateId: "d-04a23cbfcbeb41fb9dbb3be4019e1eb2",
    dynamic_template_data: {
      currentPrize,
      indexUrl: URL.INDEX,
      replyEmail: EMAIL_ADDRESS,
    },
  };
  return sgMail.sendMultiple(msg);
}

function updateNotifications() {
  let prize: number;
  return axios
    .get("https://www.jogossantacasa.pt/web/SCRss/rssFeedJackpots")
    .then((res: AxiosResponse) => getPrizeFromXml(res.data))
    .then((currentPrize: number) => {
      prize = currentPrize;
      return getEmailsWithMinprize(currentPrize);
    })
    .then((emails: IEmail[]) => sendEmails(emails, prize))
    .catch((error) => {
      logger.error("Error creating notifications. Details: ");
      logger.error(error);
    });
}

export default new CronJob("0 0 8 * * 3,6", () => {
  // export default new CronJob("0 */5 * * * *", () => {
  return updateNotifications()
    .then(() => logger.info("Notifications updated."))
    .catch(() => logger.error("Failed updating notifications."));
});
