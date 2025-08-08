import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProblem extends Document {
  title: string;
  slug: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  statement: string;
  constraints?: string;
  samples: { input: string; output: string }[];
  hiddenTests: { input: string; output: string }[];
  createdAt: Date;
  updatedAt: Date;
}

const ProblemSchema = new Schema<IProblem>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
    tags: { type: [String], default: [] },
    statement: { type: String, required: true },
    constraints: { type: String },
    samples: { type: [{ input: String, output: String }], default: [] },
    hiddenTests: { type: [{ input: String, output: String }], default: [] }
  },
  { timestamps: true }
);

let Problem: Model<IProblem>;
try {
  Problem = mongoose.model<IProblem>('Problem');
} catch {
  Problem = mongoose.model<IProblem>('Problem', ProblemSchema);
}

export default Problem;