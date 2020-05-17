import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
import {PassportLocalSchema} from 'mongoose';
import {mChat} from './chat';
import {mReview} from './review';
import {mNotification} from './notification';

export interface mUser extends mongoose.Document {
  username: string;
  password: string;
  avatar: string;
  contact_number: string;
  entry_number: string;
  hostel: string;
  chats: mChat[];
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  isBanned: boolean;
  banExpires: Date;
  isAdmin: boolean;
  description: string;
  notifs: mNotification[];
  reviews: mReview[];
  rating: number;
  folCategory: string[];
}

const UserSchema = new mongoose.Schema(
  {
    username: {type: String, unique: true, required: true},
    password: String,
    avatar: String,
    contact_number: String,
    entry_number: String,
    hostel: String,
    chats: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
      },
    ],
    firstName: String,
    lastName: String,
    fullName: String,
    email: {type: String, required: true, unique: true},
    isBanned: {type: Boolean, default: false},
    banExpires: Date,
    isAdmin: {type: Boolean, default: false},
    description: String,
    notifs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notification',
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    rating: {
      type: Number,
      default: 0,
    },
    folCategory: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

UserSchema.plugin(passportLocalMongoose);

UserSchema.virtual('fullName').get(function (this: mUser) {
  return (this.firstName || '') + ' ' + (this.lastName || '');
});

export default mongoose.model<mUser>('User', UserSchema as PassportLocalSchema);
