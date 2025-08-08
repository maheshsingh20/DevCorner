import { Request, Response } from 'express';
import Problem from '../models/Problem';

export async function listProblems(req: Request, res: Response) {
  const { tag, difficulty, q } = req.query as any;
  const filter: any = {};
  if (tag) filter.tags = tag;
  if (difficulty) filter.difficulty = difficulty;
  if (q) filter.title = { $regex: String(q), $options: 'i' };
  const items = await Problem.find(filter).select('title slug difficulty tags').limit(200).lean();
  res.json({ items });
}

export async function getProblem(req: Request, res: Response) {
  const { slug } = req.params;
  const item = await Problem.findOne({ slug }).lean();
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json({ item });
}

export async function runSample(_req: Request, res: Response) {
  // TODO: integrate Judge0 or runner
  res.json({ output: 'Sample run not yet implemented' });
}

export async function submitSolution(_req: Request, res: Response) {
  // TODO: enqueue submission and evaluate
  res.json({ verdict: 'Pending' });
}