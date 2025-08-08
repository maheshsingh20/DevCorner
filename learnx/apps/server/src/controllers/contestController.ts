import { Request, Response } from 'express';
import Contest from '../models/Contest';

export async function listContests(_req: Request, res: Response) {
  const now = new Date();
  const items = await Contest.find({ endTime: { $gte: new Date(now.getTime() - 7*24*3600*1000) } }).sort({ startTime: -1 }).lean();
  res.json({ items });
}

export async function getContest(req: Request, res: Response) {
  const { slug } = req.params;
  const item = await Contest.findOne({ slug }).lean();
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json({ item });
}

export async function leaderboard(_req: Request, res: Response) {
  res.json({ entries: [] });
}