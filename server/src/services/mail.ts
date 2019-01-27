import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';
import { URL } from '../utils/constants';

dotenv.config();
const { EMAIL_SENDGRID_API_KEY, EMAIL_ADDRESS, NODE_ENV } = process.env;

sgMail.setApiKey(EMAIL_SENDGRID_API_KEY);

const isProd = NODE_ENV === 'production';

export function sendWelcomeEmail(to: string, variables: any) {
  if (!isProd) { return Promise.resolve(); }
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

export function sendEditEmail(to: string, variables: any) {
  if (!isProd) { return Promise.resolve(); }
  const msg = {
    to,
    from: EMAIL_ADDRESS,
    templateId: 'd-5d540038d0974581968265d357e71b4d',
    dynamic_template_data: {
      minPrizeUpdated: variables.minprize,
      updateUrl: URL.UPDATE({ token: variables.token }),
      indexUrl: URL.INDEX,
    }
  };
  return sgMail.send(msg);
}

export function sendDeleteEmail(to: string, variables: any) {
  if (!isProd) { return Promise.resolve(); }
  const msg = {
    to,
    from: EMAIL_ADDRESS,
    templateId: 'd-fc48fa042b3e40168b8fb0bf9de7aeb0',
    dynamic_template_data: {
      deleteUrl: URL.DELETE({ token: variables.token }),
      indexUrl: URL.INDEX,
    }
  };
  return sgMail.send(msg);
}
