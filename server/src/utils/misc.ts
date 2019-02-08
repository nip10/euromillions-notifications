import uuidv4 from 'uuid/v4';
import { TOKEN_DURATION_IN_DAYS } from './../utils/constants';

export function generateToken(): { value: string, expiresAt: Date } {
  const dt = new Date();
  dt.setDate(dt.getDate() + TOKEN_DURATION_IN_DAYS);
  return {
    value: uuidv4(),
    expiresAt: dt,
  }
}