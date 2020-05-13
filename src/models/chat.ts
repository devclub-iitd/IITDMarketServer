import mongoose from "mongoose";
import {IUser} from './user'
import {IItem} from './item'

export interface IChat extends mongoose.Document {
    user1: IUser;
    user2: IUser;
    item: IItem;
    messages: String[];
    active: Boolean;
}

const chatSchema = new mongoose.Schema({
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item"
    },
    messages: [
        {
            type: String
        }
    ],
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

// const ArrLen = (val) => val.length === 2

// chatSchema.path('users').validate(ArrLen, '{PATH} exceeds length');


export default mongoose.model<IChat>('Chat', chatSchema);