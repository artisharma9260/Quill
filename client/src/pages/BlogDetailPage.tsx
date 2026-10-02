import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useBlog } from '../hooks/useBlogs';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import * as api from '../services/api';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ConfirmModal } from '../components/ui/Modal';
import { BlogDetailSkeleton } from '../components/ui/Skeleton';
import { formatDate } from '../utils/helpers';

export function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const { blog, isLoading, error } = useBlog(id!);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isOwner = isAuthenticated && user?.id === blog?.author.id;

  async function handleDelete() {
    setDeleting(true);
    try {
      await api.deleteBlog(id!);
      toast('Article deleted successfully', 'success');
      navigate('/');
    } catch (err: unknown) {
      const e = err as { message?: string };
      toast(e.message ?? 'Failed to delete article', 'error');
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <BlogDetailSkeleton />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h1 className="font-serif text-3xl font-bold text-[#1C1917] mb-3">Article not found</h1>
        <p className="text-[#78716C] font-sans mb-8">
          This article may have been removed or is no longer available.
        </p>
        <Link to="/">
          <Button variant="primary">Back to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#A8A29E] font-sans mb-8">
          <Link to="/" className="hover:text-[#C41E3A] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#78716C]">{blog.category}</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs font-medium font-sans uppercase tracking-wider text-[#C41E3A]">
              {blog.category}
            </span>
            {blog.status === 'draft' && (
              <Badge variant="warning">Draft</Badge>
            )}
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917] leading-tight mb-5">
            {blog.title}
          </h1>

          <p className="text-lg text-[#57534E] font-serif leading-relaxed mb-6 italic">
            {blog.excerpt}
          </p>

          {/* Author + meta */}
          <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-[#E7E5E4]">
            <div className="flex items-center gap-3">
              <img
                src={blog.author.avatar}
                alt={blog.author.name}
                className="w-10 h-10 rounded-full object-cover border border-[#E7E5E4]"
              />
              <div>
                <p className="text-sm font-semibold text-[#1C1917] font-sans">{blog.author.name}</p>
                <div className="flex items-center gap-2 text-xs text-[#A8A29E] font-sans">
                  <time dateTime={blog.createdAt}>{formatDate(blog.createdAt)}</time>
                  {blog.readingTime && (
                    <>
                      <span>·</span>
                      <span>{blog.readingTime} min read</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {isOwner && (
              <div className="flex items-center gap-2">
                <Link to={`/edit/${blog.id}`}>
                  <Button variant="outline" size="sm">
                    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </Button>
                </Link>
                <Button variant="danger" size="sm" onClick={() => setDeleteOpen(true)}>
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </Button>
              </div>
            )}
          </div>
        </header>

        {/* Featured image */}
        {blog.featuredImage && (
          <div className="mb-10 -mx-4 sm:-mx-6 lg:-mx-0">
            <img
              src={blog.featuredImage}
              alt={blog.title}
              className="w-full h-64 sm:h-80 object-cover sm:rounded-xl"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Content */}
        <div className="prose max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{blog.content}</ReactMarkdown>
        </div>

        {/* Tags */}
        {blog.tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-[#E7E5E4]">
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-mono text-[#57534E] bg-[#F5F5F4] rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Author card */}
        <div className="mt-12 p-6 bg-white border border-[#E7E5E4] rounded-xl">
          <div className="flex items-start gap-4">
            <img
              src={blog.author.avatar}
              alt={blog.author.name}
              className="w-14 h-14 rounded-full object-cover border border-[#E7E5E4]"
            />
            <div>
              <p className="text-xs text-[#A8A29E] font-sans uppercase tracking-wider mb-1">Written by</p>
              <h3 className="font-serif text-lg font-semibold text-[#1C1917]">{blog.author.name}</h3>
              <p className="text-sm text-[#78716C] font-sans mt-1">
                Member since {formatDate(blog.author.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-10 text-center">
          <Link to="/" className="text-sm text-[#78716C] hover:text-[#C41E3A] font-sans transition-colors">
            ← Back to all articles
          </Link>
        </div>
      </article>

      <ConfirmModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Article"
        message={`Are you sure you want to delete "${blog.title}"? This action cannot be undone.`}
        confirmLabel="Delete Article"
        isLoading={deleting}
      />
    </>
  );
}
