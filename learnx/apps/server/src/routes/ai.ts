import { Router } from 'express';
import { explainProblem, suggestSimilar } from '../controllers/aiController';

const router = Router();

router.post('/explain', explainProblem);
router.get('/suggest', suggestSimilar);

export default router;