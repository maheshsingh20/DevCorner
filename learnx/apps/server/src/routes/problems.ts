import { Router } from 'express';
import { getProblem, listProblems, runSample, submitSolution } from '../controllers/problemController';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

router.get('/', listProblems);
router.get('/:slug', getProblem);
router.post('/:slug/run', requireAuth, runSample);
router.post('/:slug/submit', requireAuth, submitSolution);

export default router;