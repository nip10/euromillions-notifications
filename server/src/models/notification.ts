import mongoose from '../services/db';

export interface INotificationDocument extends mongoose.Document {
  email: string,
  minprize: number,
}

const NotificationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  minPrize: {
    type: Number,
    required: true,
  }
}, {
    timestamps: true,
  });

export default mongoose.model<INotificationDocument>('Notification', NotificationSchema);