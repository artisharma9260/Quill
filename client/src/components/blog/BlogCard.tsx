import { Link } from 'react-router-dom';
import type { Blog } from '../../types';
import { Badge } from '../ui/Badge';
import { formatDate, truncate } from '../../utils/helpers';

interface BlogCardProps {
  blog: Blog;
}

const categoryColors: Record<string, string> = {
  Technology: 'bg-blue-50 text-blue-700',
  Programming: 'bg-violet-50 text-violet-700',
  AI: 'bg-purple-50 text-purple-700',
  'Web Development': 'bg-cyan-50 text-cyan-700',
  Career: 'bg-amber-50 text-amber-700',
  Education: 'bg-green-50 text-green-700',
  Lifestyle: 'bg-pink-50 text-pink-700',
  Other: 'bg-stone-50 text-stone-700',
};

export function BlogCard({ blog }: BlogCardProps) {
  const categoryClass = categoryColors[blog.category] ?? 'bg-stone-50 text-stone-700';

  return (
    <article className="group bg-white rounded-xl border border-[#E7E5E4] overflow-hidden hover:shadow-md hover:border-[#D6D3D1] transition-all duration-200">
      <Link to={`/blog/${blog.id}`} className="block">
        <div className="relative h-48 overflow-hidden bg-[#F5F5F4]">
          {blog.featuredImage ? (
            <img
              src={blog.featuredImage}
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  `https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=300&fit=crop&auto=format`;
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#D6D3D1" strokeWidth="1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          )}
          {blog.status === 'draft' && (
            <div className="absolute top-3 left-3">
              <span className="bg-amber-100 text-amber-700 text-xs font-medium px-2 py-1 rounded font-sans">
                Draft
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-5">
        <div className="mb-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium font-sans ${categoryClass}`}>
            {blog.category}
          </span>
        </div>

        <Link to={`/blog/${blog.id}`}>
          <h2 className="font-serif text-lg font-semibold text-[#1C1917] leading-snug mb-2 group-hover:text-[#C41E3A] transition-colors line-clamp-2">
            {blog.title}
          </h2>
        </Link>

        <p className="text-sm text-[#78716C] font-sans leading-relaxed mb-4 line-clamp-2">
          {truncate(blog.excerpt, 120)}
        </p>

        <div className="flex items-center gap-3 pt-3 border-t border-[#F5F5F4]">
          <img
            src={blog.author.avatar ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(blog.author.name)}&size=32`}
            alt={blog.author.name}
            className="w-8 h-8 rounded-full object-cover bg-[#E7E5E4]"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-[#1C1917] font-sans truncate">{blog.author.name}</p>
            <div className="flex items-center gap-2 text-xs text-[#A8A29E] font-sans">
              <span>{formatDate(blog.createdAt)}</span>
              {blog.readingTime && (
                <>
                  <span>·</span>
                  <span>{blog.readingTime} min read</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
