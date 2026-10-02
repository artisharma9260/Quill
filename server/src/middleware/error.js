export function notFound(_req, res) {
  res.status(404).json({ message: 'Route not found' });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((e) => e.message).join(', ');
    return res.status(400).json({ message });
  }
  if (err.code === 11000) return res.status(409).json({ message: 'Email already in use' });
  if (err.name === 'CastError') return res.status(404).json({ message: 'Not found' });
  if (err.message === 'Not allowed by CORS') return res.status(403).json({ message: err.message });
  console.error(err);
  res.status(err.status || 500).json({
    message: process.env.NODE_ENV === 'production' && !err.status ? 'Internal server error' : err.message,
  });
}

export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
