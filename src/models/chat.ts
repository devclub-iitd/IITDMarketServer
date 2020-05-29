import mongoose from 'mongoose';
import {MUser} from './user';
import {MItem} from './item';

export interface MChat extends mongoose.Document {
  user1: MUser;
  user2: MUser;
  item: MItem;
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

export default mongoose.model<MChat>('Chat', chatSchema);
