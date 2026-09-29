import type { AuthSession, LoginCredentials, LoginResponse, RegisterCredentials } from './types';

type ErrorBody = {
  message?: string;
};

export class AuthRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'AuthRequestError';
  }
}

export async function login(credentials: LoginCredentials): Promise<AuthSession> {
  const response = await fetch('/api/auth/login', {
    body: JSON.stringify(credentials),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  const result = await parseAuthResponse<LoginResponse>(response);

  return result.session;
}

export async function register(credentials: RegisterCredentials): Promise<AuthSession> {
  const response = await fetch('/api/auth/register', {
    body: JSON.stringify(credentials),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  const result = await parseAuthResponse<LoginResponse>(response);

  return result.session;
}

export async function logout(): Promise<void> {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
  });

  await parseAuthResponse(response);
}

async function parseAuthResponse<TResponse = unknown>(response: Response): Promise<TResponse> {
  const body = (await response.json().catch(() => ({}))) as ErrorBody | TResponse;

  if (!response.ok) {
    const errorMessage = (body as ErrorBody).message;
    const message =
      typeof errorMessage === 'string' ? errorMessage : 'Не удалось выполнить запрос авторизации';

    throw new AuthRequestError(message, response.status);
  }

  return body as TResponse;
}
