import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useUserBlogs } from '../hooks/useBlogs';
import * as api from '../services/api';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ConfirmModal } from '../components/ui/Modal';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { formatDateShort } from '../utils/helpers';
import type { Blog } from '../types';

type FilterStatus = '' | 'published' | 'draft';

export function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState<FilterStatus>('');
  const { blogs, isLoading, refetch } = useUserBlogs(statusFilter);

  const [deleteTarget, setDeleteTarget] = useState<Blog | null>(null);
  const [deleting, setDeleting] = useState(false);

  const published = blogs.filter((b) => b.status === 'published').length;
  const drafts = blogs.filter((b) => b.status === 'draft').length;

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.deleteBlog(deleteTarget.id);
      toast('Article deleted', 'success');
      refetch();
    } catch (err: unknown) {
      const e = err as { message?: string };
      toast(e.message ?? 'Failed to delete', 'error');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }

  const filterTabs: { label: string; value: FilterStatus }[] = [
    { label: `All (${blogs.length})`, value: '' },
    { label: `Published (${published})`, value: 'published' },
    { label: `Drafts (${drafts})`, value: 'draft' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1C1917] mb-1">Your Dashboard</h1>
          <p className="text-sm text-[#78716C] font-sans">Manage and track all your articles</p>
        </div>
        <Link to="/create">
          <Button>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Article
          </Button>
        </Link>
      </div>

      {/* Author card */}
      <div className="bg-white rounded-xl border border-[#E7E5E4] p-5 mb-8 flex items-center gap-4">
        <img
          src={user?.avatar}
          alt={user?.name}
          className="w-14 h-14 rounded-full object-cover border border-[#E7E5E4]"
        />
        <div className="flex-1">
          <h2 className="font-serif text-lg font-semibold text-[#1C1917]">{user?.name}</h2>
          <p className="text-sm text-[#78716C] font-sans">{user?.email}</p>
        </div>
        <div className="hidden sm:flex items-center gap-8">
          <StatPill label="Total" value={blogs.length} />
          <StatPill label="Published" value={published} accent />
          <StatPill label="Drafts" value={drafts} />
        </div>
      </div>

      {/* Mobile stats */}
      <div className="sm:hidden grid grid-cols-3 gap-3 mb-6">
        <StatCard label="Total" value={blogs.length} />
        <StatCard label="Published" value={published} accent />
        <StatCard label="Drafts" value={drafts} />
      </div>

      {/* Filter tabs */}
      <div className="flex border-b border-[#E7E5E4] mb-6">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-4 py-2.5 text-sm font-medium font-sans border-b-2 transition-colors ${
              statusFilter === tab.value
                ? 'border-[#C41E3A] text-[#C41E3A]'
                : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Blog table */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <EmptyState
          icon={
            <svg width="56" height="56" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
          title={statusFilter ? `No ${statusFilter} articles` : 'No articles yet'}
          description="Start writing and sharing your ideas with the world."
          action={
            <Link to="/create">
              <Button>Write your first article</Button>
            </Link>
          }
        />
      ) : (
        <div className="bg-white rounded-xl border border-[#E7E5E4] overflow-hidden">
          <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-3 bg-[#FAFAF9] border-b border-[#E7E5E4] text-xs font-medium text-[#78716C] uppercase tracking-wide font-sans">
            <span>Article</span>
            <span className="text-center w-24">Status</span>
            <span className="text-center w-28">Category</span>
            <span className="text-center w-28">Updated</span>
            <span className="text-center w-28">Actions</span>
          </div>

          <div className="divide-y divide-[#F5F5F4]">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto_auto] gap-2 sm:gap-4 px-5 py-4 hover:bg-[#FAFAF9] transition-colors items-center"
              >
                {/* Title */}
                <div className="min-w-0">
                  <Link
                    to={`/blog/${blog.id}`}
                    className="font-medium text-sm text-[#1C1917] hover:text-[#C41E3A] transition-colors font-sans line-clamp-1"
                  >
                    {blog.title}
                  </Link>
                  <p className="text-xs text-[#A8A29E] font-sans mt-0.5 line-clamp-1">
                    {blog.excerpt}
                  </p>
                </div>

                {/* Status */}
                <div className="sm:text-center sm:w-24">
                  <Badge variant={blog.status === 'published' ? 'success' : 'warning'}>
                    {blog.status === 'published' ? 'Published' : 'Draft'}
                  </Badge>
                </div>

                {/* Category */}
                <div className="sm:text-center sm:w-28">
                  <span className="text-xs text-[#78716C] font-sans">{blog.category}</span>
                </div>

                {/* Date */}
                <div className="sm:text-center sm:w-28">
                  <span className="text-xs text-[#A8A29E] font-sans">{formatDateShort(blog.updatedAt)}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 sm:justify-center sm:w-28">
                  <button
                    onClick={() => navigate(`/blog/${blog.id}`)}
                    title="View"
                    className="p-1.5 text-[#A8A29E] hover:text-[#1C1917] hover:bg-[#F5F5F4] rounded transition-colors"
                  >
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => navigate(`/edit/${blog.id}`)}
                    title="Edit"
                    className="p-1.5 text-[#A8A29E] hover:text-[#1C1917] hover:bg-[#F5F5F4] rounded transition-colors"
                  >
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setDeleteTarget(blog)}
                    title="Delete"
                    className="p-1.5 text-[#A8A29E] hover:text-[#C41E3A] hover:bg-red-50 rounded transition-colors"
                  >
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Article"
        message={`Delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        isLoading={deleting}
      />
    </div>
  );
}

function StatPill({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="text-center">
      <p className={`text-2xl font-serif font-bold ${accent ? 'text-[#C41E3A]' : 'text-[#1C1917]'}`}>
        {value}
      </p>
      <p className="text-xs text-[#A8A29E] font-sans">{label}</p>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="bg-white border border-[#E7E5E4] rounded-lg p-4 text-center">
      <p className={`text-xl font-serif font-bold ${accent ? 'text-[#C41E3A]' : 'text-[#1C1917]'}`}>
        {value}
      </p>
      <p className="text-xs text-[#A8A29E] font-sans mt-1">{label}</p>
    </div>
  );
}
