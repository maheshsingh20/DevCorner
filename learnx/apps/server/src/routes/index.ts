import { Router } from 'express';
import authRouter from './auth';
import articleRouter from './articles';
import problemRouter from './problems';
import contestRouter from './contests';
import courseRouter from './courses';
import aiRouter from './ai';
import paymentRouter from './payments';

const api = Router();

api.use('/auth', authRouter);
api.use('/articles', articleRouter);
api.use('/problems', problemRouter);
api.use('/contests', contestRouter);
api.use('/courses', courseRouter);
api.use('/ai', aiRouter);
api.use('/payments', paymentRouter);

export default api;