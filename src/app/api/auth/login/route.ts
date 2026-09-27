import { NextRequest, NextResponse } from 'next/server';

import { createAuthSession, setAuthCookie, setBackendAuthCookie } from '@/entities/auth/server';
import type { BackendAuthUser, LoginCredentials } from '@/entities/auth/types';
import { API_BASE_URL } from '@/shared/api/config';
import { AUTH_COOKIE_MAX_AGE, BACKEND_AUTH_COOKIE_NAME } from '@/shared/lib/auth';

type BackendErrorBody = {
  detail?: unknown;
  error?: {
    message?: string;
  };
};

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as Partial<LoginCredentials> | null;

  if (!body || typeof body.email !== 'string' || typeof body.password !== 'string') {
    return NextResponse.json({ message: 'Введите email и пароль' }, { status: 400 });
  }

  const backendResponse = await fetch(new URL('/auth/login', normalizedApiBaseUrl()), {
    body: JSON.stringify({
      email: body.email,
      password: body.password,
    }),
    cache: 'no-store',
    headers: buildBackendHeaders(request),
    method: 'POST',
  }).catch(() => null);

  if (!backendResponse) {
    return NextResponse.json(
      { message: 'Не удалось подключиться к серверу авторизации' },
      { status: 502 },
    );
  }

  const responseBody = (await backendResponse.json().catch(() => null)) as
    BackendAuthUser | BackendErrorBody | null;

  if (!backendResponse.ok) {
    return NextResponse.json(
      { message: getBackendErrorMessage(responseBody) },
      { status: backendResponse.status },
    );
  }

  if (!isBackendUser(responseBody)) {
    return NextResponse.json(
      { message: 'Сервер авторизации вернул неожиданный ответ' },
      { status: 502 },
    );
  }

  const backendToken = readCookieValue(
    backendResponse.headers.get('set-cookie'),
    BACKEND_AUTH_COOKIE_NAME,
  );

  if (!backendToken) {
    return NextResponse.json(
      { message: 'Сервер авторизации не вернул session cookie' },
      { status: 502 },
    );
  }

  const session = createAuthSession(responseBody);
  const response = NextResponse.json({ session });

  setAuthCookie(response, session);
  setBackendAuthCookie(response, backendToken.value, backendToken.maxAge ?? AUTH_COOKIE_MAX_AGE);

  return response;
}

function buildBackendHeaders(request: NextRequest) {
  const headers = new Headers({
    'Content-Type': 'application/json',
    'X-CSRF-Protection': '1',
  });
  const previousSession = request.cookies.get(BACKEND_AUTH_COOKIE_NAME)?.value;

  if (previousSession) {
    headers.set('Cookie', `${BACKEND_AUTH_COOKIE_NAME}=${previousSession}`);
  }

  return headers;
}

function getBackendErrorMessage(body: BackendAuthUser | BackendErrorBody | null) {
  if (body && 'error' in body && typeof body.error?.message === 'string') {
    return body.error.message;
  }

  if (body && 'detail' in body && typeof body.detail === 'string') {
    return body.detail;
  }

  return 'Неверный email или пароль';
}

function isBackendUser(value: BackendAuthUser | BackendErrorBody | null): value is BackendAuthUser {
  if (!value) {
    return false;
  }

  return (
    'id' in value &&
    'email' in value &&
    'name' in value &&
    'role' in value &&
    typeof value.id === 'number'
  );
}

function readCookieValue(setCookie: string | null, name: string) {
  if (!setCookie) {
    return null;
  }

  const match = setCookie.match(new RegExp(`(?:^|,\\s*)${name}=([^;]+)`));

  if (!match) {
    return null;
  }

  const maxAgeMatch = setCookie.match(/max-age=(\d+)/i);

  return {
    maxAge: maxAgeMatch ? Number(maxAgeMatch[1]) : undefined,
    value: decodeURIComponent(match[1]),
  };
}

function normalizedApiBaseUrl() {
  return API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
}
