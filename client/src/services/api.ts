import type {
  User,
  Blog,
  AuthResponse,
  CreateBlogDto,
  PaginatedResponse,
  BlogFilters,
} from '../types';

const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api').replace(/\/$/, '');
const TOKEN_KEY = 'blogapp_token';

// ── Token helpers ─────────────────────────────────────────────────────────────

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function setStoredToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* storage unavailable */
  }
}

function removeStoredToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage unavailable */
  }
}

// ── Request helper ────────────────────────────────────────────────────────────

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw { message: 'Cannot reach the server. Please try again shortly.', status: 0 };
  }

  if (res.status === 204) return undefined as T;

  let body: any = null;
  try {
    body = await res.json();
  } catch {
    /* non-JSON response */
  }

  if (!res.ok) {
    throw { message: body?.message ?? `Request failed (${res.status})`, status: res.status };
  }
  return body as T;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function register(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  setStoredToken(res.token);
  return res;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setStoredToken(res.token);
  return res;
}

export async function getMe(): Promise<User> {
  const res = await request<{ user: User }>('/auth/me');
  return res.user;
}

export function logout(): void {
  removeStoredToken();
}

// ── Blogs ─────────────────────────────────────────────────────────────────────

export async function getBlogs(filters: BlogFilters = {}): Promise<PaginatedResponse<Blog>> {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.category) params.set('category', filters.category);
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  const qs = params.toString();
  return request<PaginatedResponse<Blog>>(`/blogs${qs ? `?${qs}` : ''}`);
}

export async function getBlog(id: string): Promise<Blog> {
  const res = await request<{ blog: Blog }>(`/blogs/${encodeURIComponent(id)}`);
  return res.blog;
}

export async function getUserBlogs(filters: { status?: string } = {}): Promise<Blog[]> {
  const qs = filters.status ? `?status=${encodeURIComponent(filters.status)}` : '';
  const res = await request<{ data: Blog[] }>(`/blogs/mine${qs}`);
  return res.data;
}

export async function createBlog(dto: CreateBlogDto): Promise<Blog> {
  const res = await request<{ blog: Blog }>('/blogs', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
  return res.blog;
}

export async function updateBlog(id: string, dto: Partial<CreateBlogDto>): Promise<Blog> {
  const res = await request<{ blog: Blog }>(`/blogs/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(dto),
  });
  return res.blog;
}

export async function deleteBlog(id: string): Promise<void> {
  await request<void>(`/blogs/${encodeURIComponent(id)}`, { method: 'DELETE' });
}
