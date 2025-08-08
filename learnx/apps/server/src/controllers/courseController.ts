import { Request, Response } from 'express';
import Course from '../models/Course';

export async function listCourses(_req: Request, res: Response) {
  const items = await Course.find({}).select('title slug description priceCents').lean();
  res.json({ items });
}

export async function getCourse(req: Request, res: Response) {
  const { slug } = req.params;
  const item = await Course.findOne({ slug }).lean();
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json({ item });
}

export async function requestCheckout(_req: Request, res: Response) {
  res.json({ checkoutUrl: 'https://example.com/checkout' });
}