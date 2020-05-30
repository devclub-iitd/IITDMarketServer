import mongoose from 'mongoose';

export interface MMessage extends mongoose.Document {
  from: {username: string; _id: string};
  to: {username: string; _id: string};
  message: string;
}

const chatSchema = new mongoose.Schema(
  {
    from: {
      username: String,
      _id: String,
    },
    to: {
      username: String,
      _id: String,
    },
    message: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<MMessage>('Message', chatSchema);
