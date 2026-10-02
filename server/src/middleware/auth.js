import jwt from 'jsonwebtoken';
import User from '../models/User.js';

async function userFromRequest(req) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return null;
  try {
    const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    return await User.findById(payload.sub);
  } catch {
    return null;
  }
}

export async function requireAuth(req, res, next) {
  const user = await userFromRequest(req);
  if (!user) return res.status(401).json({ message: 'Unauthorized' });
  req.user = user;
  next();
}

export async function optionalAuth(req, _res, next) {
  req.user = await userFromRequest(req);
  next();
}
