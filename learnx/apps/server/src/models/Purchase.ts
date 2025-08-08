import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPurchase extends Document {
  userId: mongoose.Types.ObjectId;
  courseId?: mongoose.Types.ObjectId;
  type: 'one_time' | 'subscription';
  status: 'pending' | 'paid' | 'failed' | 'refunded' | 'canceled';
  amountCents: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

const PurchaseSchema = new Schema<IPurchase>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
  type: { type: String, enum: ['one_time', 'subscription'], required: true },
  status: { type: String, enum: ['pending', 'paid', 'failed', 'refunded', 'canceled'], default: 'pending' },
  amountCents: { type: Number, required: true },
  currency: { type: String, default: 'USD' }
}, { timestamps: true });

let Purchase: Model<IPurchase>;
try {
  Purchase = mongoose.model<IPurchase>('Purchase');
} catch {
  Purchase = mongoose.model<IPurchase>('Purchase', PurchaseSchema);
}

export default Purchase;