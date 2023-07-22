import { Router } from 'express';
const router = Router();

router.get('/', function (req, res) {
  res.json({ message: 'Welcome to Backsang Awards API!' });
});

export default router;
