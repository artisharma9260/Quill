import { Router } from 'express';
import mongoose from 'mongoose';
import Blog, { CATEGORIES, calcReadingTime } from '../models/Blog.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';

const router = Router();
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const AUTHOR_FIELDS = 'name email avatar createdAt updatedAt';
const str = (v) => String(v ?? '').trim();

function cleanBody(body, { partial = false } = {}) {
  const out = {};
  if (!partial || body.title !== undefined) out.title = str(body.title);
  if (!partial || body.excerpt !== undefined) out.excerpt = str(body.excerpt);
  if (!partial || body.content !== undefined) out.content = str(body.content);
  if (!partial || body.category !== undefined) out.category = body.category;
  if (!partial || body.featuredImage !== undefined) out.featuredImage = str(body.featuredImage) || undefined;
  if (!partial || body.tags !== undefined) {
    out.tags = Array.isArray(body.tags)
      ? [...new Set(body.tags.map(str).filter(Boolean))].slice(0, 10)
      : [];
  }
  if (body.status !== undefined) out.status = body.status;
  return out;
}

function validate(data, { partial = false } = {}) {
  if ((!partial || 'title' in data) && !data.title) return 'Title is required';
  if ((!partial || 'excerpt' in data) && !data.excerpt) return 'Excerpt is required';
  if ((!partial || 'content' in data) && !data.content) return 'Content is required';
  if ((!partial || 'category' in data) && !CATEGORIES.includes(data.category)) return 'Valid category is required';
  if ('status' in data && !['draft', 'published'].includes(data.status)) return 'Invalid status';
  return null;
}

// GET /api/blogs — published posts (+ caller's own drafts)
router.get(
  '/',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 9));
    const { search, category } = req.query;

    const visibility = req.user
      ? { $or: [{ status: 'published' }, { author: req.user._id }] }
      : { status: 'published' };
    const filter = { $and: [visibility] };

    if (category && CATEGORIES.includes(category)) filter.$and.push({ category });
    if (search && str(search)) {
      const rx = new RegExp(escapeRegex(str(search).slice(0, 100)), 'i');
      filter.$and.push({ $or: [{ title: rx }, { excerpt: rx }, { content: rx }, { category: rx }, { tags: rx }] });
    }

    const [total, data] = await Promise.all([
      Blog.countDocuments(filter),
      Blog.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('author', AUTHOR_FIELDS),
    ]);

    res.json({ data, total, page, limit, totalPages: Math.ceil(total / limit) });
  })
);

// GET /api/blogs/mine — declared before /:id
router.get(
  '/mine',
  requireAuth,
  asyncHandler(async (req, res) => {
    const filter = { author: req.user._id };
    if (['draft', 'published'].includes(req.query.status)) filter.status = req.query.status;
    const data = await Blog.find(filter).sort({ createdAt: -1 }).populate('author', AUTHOR_FIELDS);
    res.json({ data });
  })
);

router.get(
  '/:id',
  optionalAuth,
  asyncHandler(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Blog not found' });
    const blog = await Blog.findById(req.params.id).populate('author', AUTHOR_FIELDS);
    const isOwner = blog && req.user && String(blog.author._id) === String(req.user._id);
    if (!blog || (blog.status === 'draft' && !isOwner)) return res.status(404).json({ message: 'Blog not found' });
    res.json({ blog });
  })
);

router.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = cleanBody(req.body);
    const error = validate(data);
    if (error) return res.status(400).json({ message: error });

    const blog = await Blog.create({
      ...data,
      status: data.status ?? 'published',
      author: req.user._id,
      readingTime: calcReadingTime(data.content),
    });
    await blog.populate('author', AUTHOR_FIELDS);
    res.status(201).json({ blog });
  })
);

router.put(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Blog not found' });
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    if (String(blog.author) !== String(req.user._id)) return res.status(403).json({ message: 'Forbidden' });

    const data = cleanBody(req.body, { partial: true });
    const error = validate(data, { partial: true });
    if (error) return res.status(400).json({ message: error });

    Object.assign(blog, data);
    if (data.content) blog.readingTime = calcReadingTime(data.content);
    await blog.save();
    await blog.populate('author', AUTHOR_FIELDS);
    res.json({ blog });
  })
);

router.delete(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Blog not found' });
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    if (String(blog.author) !== String(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
    await blog.deleteOne();
    res.status(204).end();
  })
);

export default router;
