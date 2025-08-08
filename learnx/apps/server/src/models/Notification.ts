import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false }
}, { timestamps: { createdAt: true, updatedAt: false } });

let Notification: Model<INotification>;
try {
  Notification = mongoose.model<INotification>('Notification');
} catch {
  Notification = mongoose.model<INotification>('Notification', NotificationSchema);
}

export default Notification;