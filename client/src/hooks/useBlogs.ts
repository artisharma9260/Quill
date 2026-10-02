import { useState, useEffect, useCallback } from 'react';
import type { Blog, BlogFilters, PaginatedResponse } from '../types';
import * as api from '../services/api';

export function useBlogs(filters: BlogFilters) {
  const [data, setData] = useState<PaginatedResponse<Blog> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await api.getBlogs(filters);
      setData(result);
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message ?? 'Failed to load blogs');
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

export function useBlog(id: string) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await api.getBlog(id);
      setBlog(result);
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message ?? 'Blog not found');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { blog, isLoading, error, refetch: fetch };
}

export function useUserBlogs(status?: string) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await api.getUserBlogs({ status });
      setBlogs(result);
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message ?? 'Failed to load your blogs');
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { blogs, isLoading, error, refetch: fetch };
}
