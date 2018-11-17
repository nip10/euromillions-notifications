import mongoose from '../services/db';
import { PRIZE } from '../utils/constants';

export interface INotification {
  email: string,
  minPrize: number, // TODO: Use ts to min/max ??
  token?: {
    value: string,
    expiresAt: Date,
  },
};

export interface INotificationDocument extends INotification, mongoose.Document {};

const NotificationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  minPrize: {
    type: Number,
    required: true,
    min: PRIZE.MIN,
    max: PRIZE.MAX,
  },
  token: {
    type: {
      value: String,
      expiresAt: Date,
    },
    default: null,
  },
}, {
    timestamps: true,
  });

export default mongoose.model<INotificationDocument>('Notification', NotificationSchema);