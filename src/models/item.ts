import mongoose from "mongoose";
import { IUser } from "./user";
import { IChat } from "./chat";

export interface IItem extends mongoose.Document {
   title: String,
   image: String[]
   description: String,
   price: Number,
   seller: IUser,
   buyer: IUser,
   chats: IChat[],
   category: String,
   tag: String,
   buy_date: Date,
   ApproxTime: {
      month: Number
      year: Number,
   },
   status: String,
   isReported: Boolean,
   userIsAnonymous: Boolean
}

var itemSchema = new mongoose.Schema({
   title: {
      type: String,
      required: "Course title cannot be blank"
   },
   image: [
      {
         type: String
      }
   ],
   description: String,
   price: {
      type: Number,
      min: 0,
      validate: {
         validator: Number.isInteger,
         message: "{VALUE} is not an integer value."
      }
   },
   seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
   },
   buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
   },
   chats: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Chat',
      }
   ],
   category: {
      type: String,
      enum: ["GENERAL", "COOLER", "LAPTOP", "CYCLE", "MATTRESS",],
      trim: true,
      default: "GENERAL",
   },
   tag: String,
   buy_date: Date,
   ApproxTime: {
      month: {
         type: Number,
         min: 1,
         max: 12,
      },
      year: Number,
   },
   status: {
      type: String,
      enum: ["UNSOLD", "INPROCESS", "SOLD"],
      default: 'UNSOLD'
   },
   isReported: {
      type: Boolean,
      default: false,
   },
   userIsAnonymous: {
      type: Boolean,
      default: false,
   }
},
   {
      timestamps: true
   });

export default mongoose.model<IItem>("Item", itemSchema);