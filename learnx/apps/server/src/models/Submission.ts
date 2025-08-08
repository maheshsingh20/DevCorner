import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubmission extends Document {
  userId: mongoose.Types.ObjectId;
  problemId: mongoose.Types.ObjectId;
  language: string;
  code: string;
  verdict: 'Accepted' | 'Wrong Answer' | 'Runtime Error' | 'Time Limit Exceeded' | 'Compilation Error' | 'Pending';
  runtimeMs?: number;
  memoryKb?: number;
  createdAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  problemId: { type: Schema.Types.ObjectId, ref: 'Problem', required: true },
  language: { type: String, required: true },
  code: { type: String, required: true },
  verdict: {
    type: String,
    enum: ['Accepted', 'Wrong Answer', 'Runtime Error', 'Time Limit Exceeded', 'Compilation Error', 'Pending'],
    default: 'Pending'
  },
  runtimeMs: { type: Number },
  memoryKb: { type: Number }
}, { timestamps: { createdAt: true, updatedAt: false } });

let Submission: Model<ISubmission>;
try {
  Submission = mongoose.model<ISubmission>('Submission');
} catch {
  Submission = mongoose.model<ISubmission>('Submission', SubmissionSchema);
}

export default Submission;