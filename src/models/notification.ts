import mongoose from "mongoose";
import { IItem } from "./item";

export interface INotification extends mongoose.Document {
	targetItem: IItem
	message: String
	isRead: Boolean
}

const notificationSchema = new mongoose.Schema({
	targetItem: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Item'
	},
	message: String,
	isRead: { type: Boolean, default: false }
}, {
	timestamps: true
});

export default mongoose.model<INotification>("Notification", notificationSchema);