import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';
import { URL } from '../utils/constants';

dotenv.config();
const { EMAIL_SENDGRID_API_KEY, EMAIL_ADDRESS } = process.env;

sgMail.setApiKey(EMAIL_SENDGRID_API_KEY);

// const isDev = NODE_ENV === 'development';

export function sendWelcomeEmail(to: string, variables: any) {
  const msg = {
    to,
    from: EMAIL_ADDRESS,
    templateId: 'd-ed1f1d388c3e4476bdf599ec34f9a516',
    dynamic_template_data: {
      minPrize: variables.minPrize,
      indexUrl: URL.INDEX,
    }
  };
  return sgMail.send(msg);
}


