import { API_BASE_URL } from './config';

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
  const { body, headers, query, ...fetchOptions } = options;
  const requestHeaders = new Headers(headers);
  const url = buildApiUrl(endpoint, query);
  const requestBody = prepareBody(body, requestHeaders);

  const response = await fetch(url, {
    ...fetchOptions,
    body: requestBody,
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
    return undefined as TResponse;
  }

  return (await parseResponseBody(response)) as TResponse;
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
