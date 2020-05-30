import mongoose from 'mongoose';
import { MMessage } from './message';

export interface MChat extends mongoose.Document {
  user1: {username: string, _id: string};
  user2: {username: string, _id: string};
  item: {title: string, _id: string};
  messages: MMessage[];
  active: boolean;
}

const chatSchema = new mongoose.Schema(
  {
    user1: {
      username: String,
      _id: String
    },
    user2: {
      username: String,
      _id: String
    },
    item: {
      title: String,
      _id: String
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
      }
    ],
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// const ArrLen = (val) => val.length === 2

// chatSchema.path('users').validate(ArrLen, '{PATH} exceeds length');

export default mongoose.model<MChat>('Chat', chatSchema);
