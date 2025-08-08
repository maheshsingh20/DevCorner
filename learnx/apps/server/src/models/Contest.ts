import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IContest extends Document {
  name: string;
  slug: string;
  startTime: Date;
  endTime: Date;
  problemIds: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ContestSchema = new Schema<IContest>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  problemIds: [{ type: Schema.Types.ObjectId, ref: 'Problem' }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

let Contest: Model<IContest>;
try {
  Contest = mongoose.model<IContest>('Contest');
} catch {
  Contest = mongoose.model<IContest>('Contest', ContestSchema);
}

export default Contest;