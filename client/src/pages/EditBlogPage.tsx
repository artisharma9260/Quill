import { useState, useEffect, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { BlogEditor } from '../components/blog/BlogEditor';
import { BlogDetailSkeleton } from '../components/ui/Skeleton';
import { CATEGORIES, type Category, type CreateBlogDto, type Blog } from '../types';

const CATEGORY_OPTIONS = CATEGORIES.map((c) => ({ value: c, label: c }));

export function EditBlogPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoadingBlog, setIsLoadingBlog] = useState(true);
  const [form, setForm] = useState<CreateBlogDto>({
    title: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    category: '' as Category,
    tags: [],
    status: 'draft',
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    api
      .getBlog(id!)
      .then((b) => {
        if (b.author.id !== user?.id) {
          toast('You can only edit your own articles', 'error');
          navigate('/dashboard');
          return;
        }
        setBlog(b);
        setForm({
          title: b.title,
          excerpt: b.excerpt,
          content: b.content,
          featuredImage: b.featuredImage ?? '',
          category: b.category,
          tags: b.tags,
          status: b.status,
        });
      })
      .catch(() => {
        toast('Article not found', 'error');
        navigate('/dashboard');
      })
      .finally(() => setIsLoadingBlog(false));
  }, [id, user?.id]);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    else if (form.title.length > 150) errs.title = 'Title must be under 150 characters';
    if (!form.excerpt.trim()) errs.excerpt = 'Excerpt is required';
    else if (form.excerpt.length > 300) errs.excerpt = 'Excerpt must be under 300 characters';
    if (!form.content.trim()) errs.content = 'Content is required';
    if (!form.category) errs.category = 'Please select a category';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const updated = await api.updateBlog(id!, form);
      toast('Article updated successfully', 'success');
      navigate(`/blog/${updated.id}`);
    } catch (err: unknown) {
      const e = err as { message?: string };
      toast(e.message ?? 'Failed to update article', 'error');
    } finally {
      setIsLoading(false);
    }
  }

  function addTag() {
    const tag = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
    if (tag && !form.tags.includes(tag) && form.tags.length < 10) {
      setForm({ ...form, tags: [...form.tags, tag] });
      setTagInput('');
    }
  }

  function removeTag(tag: string) {
    setForm({ ...form, tags: form.tags.filter((t) => t !== tag) });
  }

  if (isLoadingBlog) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <BlogDetailSkeleton />
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-[#1C1917] mb-2">Edit Article</h1>
        <p className="text-sm text-[#78716C] font-sans">
          Update your article. Changes are saved immediately when you submit.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Title"
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          error={errors.title}
          placeholder="An engaging title for your article"
          maxLength={150}
          hint={`${form.title.length}/150 characters`}
        />

        <Textarea
          label="Excerpt"
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          error={errors.excerpt}
          placeholder="A short summary shown on the blog card"
          rows={3}
          maxLength={300}
          charCount={form.excerpt.length}
          maxChars={300}
        />

        <BlogEditor
          value={form.content}
          onChange={(v) => setForm({ ...form, content: v })}
          error={errors.content}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
            error={errors.category}
            options={CATEGORY_OPTIONS}
            placeholder="Select a category"
          />
          <Select
            label="Status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as 'draft' | 'published' })}
            options={[
              { value: 'draft', label: 'Draft (private)' },
              { value: 'published', label: 'Published (public)' },
            ]}
          />
        </div>

        <Input
          label="Featured Image URL"
          type="url"
          value={form.featuredImage}
          onChange={(e) => setForm({ ...form, featuredImage: e.target.value })}
          placeholder="https://images.unsplash.com/photo-..."
          hint="Optional — paste a URL to an image"
        />

        <div className="space-y-2">
          <label className="text-sm font-medium text-[#1C1917] font-sans">Tags</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
              placeholder="Add a tag and press Enter"
              className="flex-1 px-3 py-2.5 rounded-md border border-[#E7E5E4] text-sm font-sans text-[#1C1917] bg-white focus:outline-none focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent placeholder:text-[#A8A29E]"
            />
            <Button type="button" variant="secondary" onClick={addTag}>Add</Button>
          </div>
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-[#F5F5F4] rounded-full text-xs font-mono text-[#57534E]"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-[#C41E3A] transition-colors ml-0.5"
                  >
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {form.featuredImage && (
          <div>
            <p className="text-xs text-[#78716C] font-sans mb-2">Image preview:</p>
            <img
              src={form.featuredImage}
              alt="Preview"
              className="w-full max-h-48 object-cover rounded-lg border border-[#E7E5E4]"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
        )}

        <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#E7E5E4]">
          <Button type="button" variant="secondary" onClick={() => navigate(`/blog/${id}`)}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
