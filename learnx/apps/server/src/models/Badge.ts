import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBadge extends Document {
  key: string;
  name: string;
  description: string;
  icon?: string;
}

const BadgeSchema = new Schema<IBadge>({
  key: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String }
});

let Badge: Model<IBadge>;
try {
  Badge = mongoose.model<IBadge>('Badge');
} catch {
  Badge = mongoose.model<IBadge>('Badge', BadgeSchema);
}

export default Badge;