import { Router } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();
const SECRET = process.env.JWT_SECRET || 'dev_secret_key';

// Simple login for demo: accepts { username, password } and returns token for any non-empty credentials
router.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  // In real app validate user from DB. Here we create a token with username.
  const token = jwt.sign({ username }, SECRET, { expiresIn: '2h' });
  res.json({ token });
});

export default router;