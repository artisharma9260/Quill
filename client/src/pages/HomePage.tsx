import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useBlogs } from '../hooks/useBlogs';
import { useAuth } from '../context/AuthContext';
import { BlogCard } from '../components/blog/BlogCard';
import { BlogCardSkeleton } from '../components/ui/Skeleton';
import { Pagination } from '../components/ui/Pagination';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { CATEGORIES, type Category } from '../types';

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();

  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [searchInput, setSearchInput] = useState(searchParams.get('search') ?? '');
  const [category, setCategory] = useState<Category | ''>(
    (searchParams.get('category') as Category) ?? ''
  );
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  const { data, isLoading } = useBlogs({ search, category, page, limit: 9 });

  useEffect(() => {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (page > 1) params.page = String(page);
    setSearchParams(params, { replace: true });
  }, [search, category, page, setSearchParams]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  }

  function handleCategoryChange(cat: Category | '') {
    setCategory(cat);
    setPage(1);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1C1917] mb-4 leading-tight">
          Ideas worth reading
        </h1>
        <p className="text-lg text-[#78716C] font-sans max-w-xl mx-auto">
          Discover thoughtful writing on technology, craft, culture, and the ideas that shape how we work and live.
        </p>

        {/* Search */}
        <form onSubmit={handleSearch} className="mt-8 flex gap-2 max-w-md mx-auto">
          <div className="flex-1 relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A29E]"
              width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E7E5E4] text-sm font-sans text-[#1C1917] bg-white focus:outline-none focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent placeholder:text-[#A8A29E]"
            />
          </div>
          <Button type="submit" variant="primary">Search</Button>
          {isAuthenticated && (
            <Link to="/create">
              <Button variant="outline">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Write
              </Button>
            </Link>
          )}
        </form>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        <button
          onClick={() => handleCategoryChange('')}
          className={`px-4 py-1.5 rounded-full text-sm font-sans font-medium transition-colors ${
            category === ''
              ? 'bg-[#1C1917] text-white'
              : 'bg-white border border-[#E7E5E4] text-[#57534E] hover:border-[#C41E3A] hover:text-[#C41E3A]'
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-sans font-medium transition-colors ${
              category === cat
                ? 'bg-[#1C1917] text-white'
                : 'bg-white border border-[#E7E5E4] text-[#57534E] hover:border-[#C41E3A] hover:text-[#C41E3A]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results info */}
      {(search || category) && !isLoading && data && (
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-[#78716C] font-sans">
            {data.total} {data.total === 1 ? 'article' : 'articles'}
            {search && ` for "${search}"`}
            {category && ` in ${category}`}
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSearchInput('');
              setCategory('');
              setPage(1);
            }}
            className="text-sm text-[#C41E3A] hover:underline font-sans"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Blog grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <BlogCardSkeleton key={i} />
          ))}
        </div>
      ) : data && data.data.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.data.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
          <div className="mt-10">
            <Pagination
              page={page}
              totalPages={data.totalPages}
              onPageChange={(p) => {
                setPage(p);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        </>
      ) : (
        <EmptyState
          icon={
            <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          }
          title={search || category ? 'No articles found' : 'No articles yet'}
          description={
            search || category
              ? 'Try adjusting your search or filters to find something.'
              : 'Be the first to publish something great. Share your ideas with the world.'
          }
          action={
            isAuthenticated ? (
              <Link to="/create">
                <Button>Write the first article</Button>
              </Link>
            ) : (
              <Link to="/register">
                <Button>Get started — it's free</Button>
              </Link>
            )
          }
        />
      )}
    </div>
  );
}
