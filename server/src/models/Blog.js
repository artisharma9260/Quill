import mongoose from 'mongoose';

export const CATEGORIES = [
  'Technology', 'Programming', 'AI', 'Web Development',
  'Career', 'Education', 'Lifestyle', 'Other',
];

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    excerpt: { type: String, required: true, trim: true, maxlength: 500 },
    content: { type: String, required: true },
    featuredImage: { type: String, trim: true },
    category: { type: String, enum: CATEGORIES, required: true },
    tags: { type: [String], default: [] },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: { type: String, enum: ['draft', 'published'], default: 'published', index: true },
    readingTime: { type: Number, default: 1 },
  },
  { timestamps: true }
);

blogSchema.index({ createdAt: -1 });

blogSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export function calcReadingTime(content) {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default mongoose.model('Blog', blogSchema);
