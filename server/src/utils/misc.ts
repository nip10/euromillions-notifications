import { v4 as uuidv4 } from "uuid";
import { TOKEN_DURATION_IN_DAYS } from "./../utils/constants";

export interface IToken {
  value: string;
  expiresAt: Date;
}

export function generateToken(): IToken {
  const dt = new Date();
  dt.setDate(dt.getDate() + TOKEN_DURATION_IN_DAYS);
  return {
    value: uuidv4(),
    expiresAt: dt,
  };
}
