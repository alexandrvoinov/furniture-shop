import { API_BASE_URL } from './config';
import { BACKEND_AUTH_COOKIE_NAME } from '../lib/auth';

type QueryValue = boolean | null | number | string | undefined;
type QueryParams = Record<string, QueryValue>;
type JsonBody = Record<string, unknown> | unknown[];

type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: BodyInit | JsonBody | null;
  query?: QueryParams;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiRequest<TResponse>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<TResponse> {
  const { data } = await apiRequestWithMeta<TResponse>(endpoint, options);

  return data;
}

export async function apiRequestWithMeta<TResponse>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<{ data: TResponse; headers: Headers; status: number }> {
  const { body, headers, query, ...fetchOptions } = options;
  const requestHeaders = new Headers(headers);
  const url = buildApiUrl(endpoint, query);
  const requestBody = prepareBody(body, requestHeaders);
  const method = (fetchOptions.method ?? 'GET').toUpperCase();

  setCsrfHeader(requestHeaders, method);
  await attachServerAuthCookie(requestHeaders);

  const response = await fetch(url, {
    ...fetchOptions,
    body: requestBody,
    credentials: fetchOptions.credentials ?? 'include',
    headers: requestHeaders,
  });

  if (!response.ok) {
    const details = await parseResponseBody(response);
    throw new ApiError(
      `API request failed with status ${response.status}`,
      response.status,
      details,
    );
  }

  if (response.status === 204) {
    return {
      data: undefined as TResponse,
      headers: response.headers,
      status: response.status,
    };
  }

  return {
    data: (await parseResponseBody(response)) as TResponse,
    headers: response.headers,
    status: response.status,
  };
}

function buildApiUrl(endpoint: string, query?: QueryParams) {
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
  const normalizedEndpoint = endpoint.replace(/^\//, '');
  const url = new URL(normalizedEndpoint, baseUrl);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url;
}

function prepareBody(body: ApiRequestOptions['body'], headers: Headers) {
  if (body === undefined || body === null) {
    return body;
  }

  if (isJsonBody(body)) {
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    return JSON.stringify(body);
  }

  return body;
}

function setCsrfHeader(headers: Headers, method: string) {
  if (['DELETE', 'POST', 'PUT'].includes(method) && !headers.has('X-CSRF-Protection')) {
    headers.set('X-CSRF-Protection', '1');
  }
}

async function attachServerAuthCookie(headers: Headers) {
  if (typeof window !== 'undefined' || headers.has('Cookie')) {
    return;
  }

  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const session = cookieStore.get(BACKEND_AUTH_COOKIE_NAME)?.value;

  if (session) {
    headers.set('Cookie', `${BACKEND_AUTH_COOKIE_NAME}=${session}`);
  }
}

function isJsonBody(body: ApiRequestOptions['body']): body is JsonBody {
  if (Array.isArray(body)) {
    return true;
  }

  return (
    typeof body === 'object' &&
    body !== null &&
    !(body instanceof ArrayBuffer) &&
    !(body instanceof Blob) &&
    !(body instanceof FormData) &&
    !(body instanceof URLSearchParams)
  );
}

async function parseResponseBody(response: Response) {
  const text = await response.text();

  if (!text) {
    return undefined;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}
