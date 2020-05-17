import mongoose from "mongoose";

export interface INotification extends mongoose.Document {
	target: String
	message: String
	isRead: Boolean
	isItem: Boolean
}

const notificationSchema = new mongoose.Schema({
	target: String,
	message: String,
	isRead: { type: Boolean, default: false },
	isItem: Boolean
}, {
	timestamps: true
});

export default mongoose.model<INotification>("Notification", notificationSchema);