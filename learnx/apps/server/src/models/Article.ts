import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IComment {
  userId: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
}

export interface IArticle extends Document {
  title: string;
  slug: string;
  content: string;
  authorId: mongoose.Types.ObjectId;
  tags: string[];
  likes: number;
  comments: IComment[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const ArticleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    content: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tags: { type: [String], default: [] },
    likes: { type: Number, default: 0 },
    comments: { type: [CommentSchema], default: [] },
    published: { type: Boolean, default: false }
  },
  { timestamps: true }
);

let Article: Model<IArticle>;
try {
  Article = mongoose.model<IArticle>('Article');
} catch {
  Article = mongoose.model<IArticle>('Article', ArticleSchema);
}

export default Article;