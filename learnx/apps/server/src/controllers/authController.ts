import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import User from '../models/User';
import { signAccessToken } from '../utils/jwt';

const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(6)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export async function register(req: Request, res: Response) {
  const parse = registerSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: 'Invalid input', details: parse.error.flatten() });
  }
  const { email, name, password } = parse.data;
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ error: 'Email already registered' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, name, passwordHash });
  const token = signAccessToken({ sub: user.id, role: user.role });
  res.cookie('access_token', token, { httpOnly: true, sameSite: 'lax', secure: false, maxAge: 7 * 24 * 3600 * 1000 });
  return res.status(201).json({ user: sanitize(user), token });
}

export async function login(req: Request, res: Response) {
  const parse = loginSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  const { email, password } = parse.data;
  const user = await User.findOne({ email });
  if (!user || !user.passwordHash) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = signAccessToken({ sub: user.id, role: user.role });
  res.cookie('access_token', token, { httpOnly: true, sameSite: 'lax', secure: false, maxAge: 7 * 24 * 3600 * 1000 });
  return res.json({ user: sanitize(user), token });
}

export async function me(req: Request, res: Response) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : undefined;
  const cookieToken = (req as any).cookies?.access_token as string | undefined;
  const t = token || cookieToken;
  if (!t) return res.status(401).json({ error: 'Unauthorized' });
  // No DB look-up for simplicity; return sanitized user by id
  const payload = require('../utils/jwt').verifyAccessToken(t);
  if (!payload) return res.status(401).json({ error: 'Unauthorized' });
  const user = await User.findById(payload.sub).lean();
  if (!user) return res.status(404).json({ error: 'User not found' });
  return res.json({ user: sanitize(user) });
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie('access_token');
  return res.json({ ok: true });
}

function sanitize(user: any) {
  const { passwordHash, __v, ...u } = user.toObject ? user.toObject() : user;
  return u;
}