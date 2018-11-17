import mongoose from '../services/db';

export interface INotification {
  email: string,
  minPrize: number,
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