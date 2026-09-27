import { cookies } from 'next/headers';
import type { NextResponse } from 'next/server';

import { API_BASE_URL } from '@/shared/api/config';
import {
  AUTH_COOKIE_MAX_AGE,
  AUTH_COOKIE_NAME,
  AUTH_DEFAULT_REDIRECT,
  AUTH_LOGIN_ROUTE,
  BACKEND_AUTH_COOKIE_NAME,
  getDefaultRouteByRole,
} from '@/shared/lib/auth';

import type { AuthRole, AuthSession, BackendAuthUser } from './types';

type CredentialsHint = {
  email: string;
  label: string;
  password?: string;
  role: AuthRole;
};

export async function getAuthSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const backendSession = cookieStore.get(BACKEND_AUTH_COOKIE_NAME)?.value;

  if (!backendSession) {
    return null;
  }

  const user = await fetchBackendUser(backendSession);

  return user ? createAuthSession(user) : null;
}

export function createAuthSession(user: BackendAuthUser): AuthSession {
  return {
    expiresAt: new Date(Date.now() + AUTH_COOKIE_MAX_AGE * 1000).toISOString(),
    user: {
      email: user.email,
      id: String(user.id),
      isActive: user.is_active,
      name: user.name,
      phone: user.phone,
      role: user.role,
    },
  };
}

export function setAuthCookie(response: NextResponse, session: AuthSession) {
  response.cookies.set(AUTH_COOKIE_NAME, encodeAuthSession(session), {
    httpOnly: true,
    maxAge: AUTH_COOKIE_MAX_AGE,
    path: '/',
    sameSite: 'lax',
    secure: isSecureCookie(),
  });
}

export function setBackendAuthCookie(
  response: NextResponse,
  token: string,
  maxAge = AUTH_COOKIE_MAX_AGE,
) {
  response.cookies.set(BACKEND_AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    maxAge,
    path: '/',
    sameSite: 'lax',
    secure: isSecureCookie(),
  });
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.set(AUTH_COOKIE_NAME, '', {
    httpOnly: true,
    maxAge: 0,
    path: '/',
    sameSite: 'lax',
    secure: isSecureCookie(),
  });
}

export function clearBackendAuthCookie(response: NextResponse) {
  response.cookies.set(BACKEND_AUTH_COOKIE_NAME, '', {
    httpOnly: true,
    maxAge: 0,
    path: '/',
    sameSite: 'lax',
    secure: isSecureCookie(),
  });
}

export function getSafeRedirectPath(value: string | null | undefined) {
  if (
    !value ||
    !value.startsWith('/') ||
    value.startsWith('//') ||
    value.startsWith('/api/') ||
    value === AUTH_LOGIN_ROUTE ||
    value.startsWith(`${AUTH_LOGIN_ROUTE}?`)
  ) {
    return AUTH_DEFAULT_REDIRECT;
  }

  return value;
}

export function getRedirectPathForSession(session: AuthSession | null) {
  return getDefaultRouteByRole(session?.user.role);
}

export function getDemoCredentialsHint(): CredentialsHint[] {
  return [];
}

function encodeAuthSession(session: AuthSession) {
  return Buffer.from(JSON.stringify(session), 'utf8').toString('base64url');
}

async function fetchBackendUser(backendSession: string): Promise<BackendAuthUser | null> {
  const response = await fetch(new URL('/auth/me', normalizedApiBaseUrl()), {
    cache: 'no-store',
    headers: {
      Cookie: `${BACKEND_AUTH_COOKIE_NAME}=${backendSession}`,
    },
  }).catch(() => null);

  if (!response?.ok) {
    return null;
  }

  return (await response.json().catch(() => null)) as BackendAuthUser | null;
}

function normalizedApiBaseUrl() {
  return API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
}

function isSecureCookie() {
  return API_BASE_URL.startsWith('https://');
}
