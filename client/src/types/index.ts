export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  category: Category;
  tags: string[];
  author: User;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
  readingTime?: number;
}

export type Category =
  | 'Technology'
  | 'Programming'
  | 'AI'
  | 'Web Development'
  | 'Career'
  | 'Education'
  | 'Lifestyle'
  | 'Other';

export const CATEGORIES: Category[] = [
  'Technology',
  'Programming',
  'AI',
  'Web Development',
  'Career',
  'Education',
  'Lifestyle',
  'Other',
];

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  message: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BlogFilters {
  search?: string;
  category?: Category | '';
  status?: 'published' | 'draft' | '';
  page?: number;
  limit?: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface CreateBlogDto {
  title: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  category: Category;
  tags: string[];
  status: 'draft' | 'published';
}
