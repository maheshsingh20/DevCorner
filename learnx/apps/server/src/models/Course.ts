import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILesson {
  title: string;
  type: 'video' | 'pdf' | 'quiz' | 'practice';
  contentUrl?: string;
  durationSec?: number;
}

export interface ICourse extends Document {
  title: string;
  slug: string;
  description: string;
  priceCents: number;
  modules: { title: string; lessons: ILesson[] }[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const LessonSchema = new Schema<ILesson>({
  title: { type: String, required: true },
  type: { type: String, enum: ['video', 'pdf', 'quiz', 'practice'], required: true },
  contentUrl: { type: String },
  durationSec: { type: Number }
}, { _id: false });

const CourseSchema = new Schema<ICourse>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  priceCents: { type: Number, default: 0 },
  modules: [{ title: String, lessons: [LessonSchema] }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

let Course: Model<ICourse>;
try {
  Course = mongoose.model<ICourse>('Course');
} catch {
  Course = mongoose.model<ICourse>('Course', CourseSchema);
}

export default Course;