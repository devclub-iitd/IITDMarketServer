import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import {PassportLocalSchema} from 'mongoose';
import {Document} from 'mongoose'
import { IChat } from "./chat";
import { IReview } from "./review";

export interface IUser extends mongoose.Document {
    username: String;
    password: String;
    avatar: String;
    contact_number: String;
    entry_number: String;
    hostel: String;
    chats: IChat[];
    firstName: String;
    lastName: String;
    fullName: String
    email: String;
    isBanned: Boolean;
    banExpires: Date;
    isAdmin: Boolean;
    description: String;
    notifs: Document[];
    reviews: IReview[];
    rating: Number;
    folCategory: String[];
}

const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: String,
    avatar: String,
    contact_number: String,
    entry_number: String,
    hostel: String,
    chats: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Chat'
        }
    ],
    firstName: String,
    lastName: String,
    fullName: String,
    email: { type: String, required: true, unique: true },
    isBanned: { type: Boolean, default: false },
    banExpires: Date,
    isAdmin: { type: Boolean, default: false },
    description: String,
    notifs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Notification'
        }
    ],
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    rating: {
        type: Number,
        default: 0
    },
    folCategory: [
        {
            type: String
        }
    ]
}, {
    timestamps: true
});

UserSchema.plugin(passportLocalMongoose)

UserSchema.virtual("fullName").get(function(this: IUser) {
    return (this.firstName || "") + " " + (this.lastName || "");
  });

export default mongoose.model<IUser>("User", UserSchema as PassportLocalSchema);