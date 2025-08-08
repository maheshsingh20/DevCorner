import { Router } from 'express';
import { getContest, leaderboard, listContests } from '../controllers/contestController';

const router = Router();

router.get('/', listContests);
router.get('/:slug', getContest);
router.get('/:slug/leaderboard', leaderboard);

export default router;