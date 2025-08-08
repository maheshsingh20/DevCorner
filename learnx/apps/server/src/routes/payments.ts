import { Router } from 'express';

const router = Router();

router.post('/webhook', (req, res) => {
  // TODO: verify signature and handle events
  res.json({ received: true });
});

export default router;