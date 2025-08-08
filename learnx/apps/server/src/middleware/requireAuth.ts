import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';

export interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || '';
  const tokenFromHeader = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : undefined;
  const tokenFromCookie = (req as any).cookies?.access_token as string | undefined;
  const token = tokenFromHeader || tokenFromCookie;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const payload = verifyAccessToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  req.user = { id: payload.sub, role: payload.role };
  next();
}