const DEFAULT_LOCAL_API_URL = 'http://127.0.0.1:8000';

if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is required for production builds.');
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_LOCAL_API_URL;
