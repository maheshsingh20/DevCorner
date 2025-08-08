import { Request, Response } from 'express';
import { z } from 'zod';
import Article from '../models/Article';

const createSchema = z.object({ title: z.string(), slug: z.string(), content: z.string(), tags: z.array(z.string()).optional() });

export async function listArticles(_req: Request, res: Response) {
  const items = await Article.find({ published: true }).sort({ createdAt: -1 }).limit(50).lean();
  res.json({ items });
}

export async function getArticle(req: Request, res: Response) {
  const { slug } = req.params;
  const item = await Article.findOne({ slug, published: true }).lean();
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json({ item });
}

export async function createArticle(req: Request, res: Response) {
  const parse = createSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: 'Invalid input' });
  const item = await Article.create({ ...parse.data, authorId: (req as any).user?.id });
  res.status(201).json({ item });
}

export async function updateArticle(req: Request, res: Response) {
  const { slug } = req.params;
  const item = await Article.findOneAndUpdate({ slug }, req.body, { new: true });
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json({ item });
}

export async function likeArticle(req: Request, res: Response) {
  const { slug } = req.params;
  const item = await Article.findOneAndUpdate({ slug }, { $inc: { likes: 1 } }, { new: true });
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json({ likes: item.likes });
}