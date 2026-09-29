import { NextRequest, NextResponse } from 'next/server';

import { createAuthSession, setAuthCookie, setBackendAuthCookie } from '@/entities/auth/server';
import type { BackendAuthUser, RegisterCredentials } from '@/entities/auth/types';
import { API_BASE_URL } from '@/shared/api/config';
import { AUTH_COOKIE_MAX_AGE, BACKEND_AUTH_COOKIE_NAME } from '@/shared/lib/auth';

type BackendErrorBody = {
  detail?: unknown;
  error?: {
    message?: string;
  };
};

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as Partial<RegisterCredentials> | null;

  if (
    !body ||
    typeof body.name !== 'string' ||
    typeof body.email !== 'string' ||
    typeof body.phone !== 'string' ||
    typeof body.password !== 'string'
  ) {
    return NextResponse.json(
      { message: 'Заполните имя, телефон, email и пароль' },
      { status: 400 },
    );
  }

  const backendResponse = await fetch(new URL('/auth/register', normalizedApiBaseUrl()), {
    body: JSON.stringify({
      email: body.email,
      name: body.name,
      password: body.password,
      phone: body.phone,
    }),
    cache: 'no-store',
    headers: buildBackendHeaders(request),
    method: 'POST',
  }).catch(() => null);

  if (!backendResponse) {
    return NextResponse.json(
      { message: 'Не удалось подключиться к серверу регистрации' },
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
      { message: 'Сервер регистрации вернул неожиданный ответ' },
      { status: 502 },
    );
  }

  const backendToken = readCookieValue(
    backendResponse.headers.get('set-cookie'),
    BACKEND_AUTH_COOKIE_NAME,
  );

  if (!backendToken) {
    return NextResponse.json(
      { message: 'Сервер регистрации не вернул session cookie' },
      { status: 502 },
    );
  }

  const session = createAuthSession(responseBody);
  const response = NextResponse.json({ session }, { status: 201 });

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

  return 'Не удалось зарегистрироваться';
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
