import mongoose from 'mongoose';
import {mUser} from './user';
import {mItem} from './item';

export interface mChat extends mongoose.Document {
  user1: mUser;
  user2: mUser;
  item: mItem;
  messages: string[];
  active: boolean;
}

const chatSchema = new mongoose.Schema(
  {
    user1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    user2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
    },
    messages: [
      {
        type: String,
      },
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

export default mongoose.model<mChat>('Chat', chatSchema);
