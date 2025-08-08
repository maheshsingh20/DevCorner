import { Router } from 'express';
import { getCourse, listCourses, requestCheckout } from '../controllers/courseController';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

router.get('/', listCourses);
router.get('/:slug', getCourse);
router.post('/:slug/checkout', requireAuth, requestCheckout);

export default router;