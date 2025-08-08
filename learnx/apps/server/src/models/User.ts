import mongoose, { Schema, Document, Model } from 'mongoose';

export type UserRole = 'student' | 'instructor' | 'admin';

export interface IUser extends Document {
  email: string;
  name: string;
  passwordHash?: string;
  role: UserRole;
  avatarUrl?: string;
  bio?: string;
  xp: number;
  badges: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    passwordHash: { type: String },
    role: { type: String, enum: ['student', 'instructor', 'admin'], default: 'student' },
    avatarUrl: { type: String },
    bio: { type: String },
    xp: { type: Number, default: 0 },
    badges: { type: [String], default: [] }
  },
  { timestamps: true }
);

let User: Model<IUser>;
try {
  User = mongoose.model<IUser>('User');
} catch (e) {
  User = mongoose.model<IUser>('User', UserSchema);
}

export default User;