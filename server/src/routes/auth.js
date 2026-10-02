import { Router } from 'express';
import jwt from 'jsonwebtoken';
import User, { avatarFor } from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';

const router = Router();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function signToken(user) {
  return jwt.sign({ sub: String(user._id) }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const name = String(req.body.name ?? '').trim();
    const email = String(req.body.email ?? '').trim().toLowerCase();
    const password = String(req.body.password ?? '');

    if (name.length < 2) return res.status(400).json({ message: 'Name must be at least 2 characters' });
    if (!EMAIL_RE.test(email)) return res.status(400).json({ message: 'Enter a valid email address' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });

    if (await User.exists({ email })) return res.status(409).json({ message: 'Email already in use' });

    const user = await User.create({ name, email, password, avatar: avatarFor(name, email) });
    res.status(201).json({ user: user.toJSON(), token: signToken(user) });
  })
);

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const email = String(req.body.email ?? '').trim().toLowerCase();
    const password = String(req.body.password ?? '');
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.json({ user: user.toJSON(), token: signToken(user) });
  })
);

router.get('/me', requireAuth, (req, res) => res.json({ user: req.user.toJSON() }));

export default router;
