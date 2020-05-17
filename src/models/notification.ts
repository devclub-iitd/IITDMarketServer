import mongoose from 'mongoose';

export interface mNotification extends mongoose.Document {
  target: string;
  message: string;
  isRead: boolean;
  isItem: boolean;
}

const notificationSchema = new mongoose.Schema(
  {
    target: String,
    message: String,
    isRead: {type: Boolean, default: false},
    isItem: Boolean,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<mNotification>(
  'Notification',
  notificationSchema
);
