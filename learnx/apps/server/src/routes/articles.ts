import { Router } from 'express';
import { createArticle, getArticle, listArticles, likeArticle, updateArticle } from '../controllers/articleController';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

router.get('/', listArticles);
router.get('/:slug', getArticle);
router.post('/', requireAuth, createArticle);
router.patch('/:slug', requireAuth, updateArticle);
router.post('/:slug/like', requireAuth, likeArticle);

export default router;