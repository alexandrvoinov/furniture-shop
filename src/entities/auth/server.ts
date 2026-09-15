import { cookies } from 'next/headers';
import type { NextResponse } from 'next/server';

import {
  AUTH_COOKIE_MAX_AGE,
  AUTH_COOKIE_NAME,
  AUTH_DEFAULT_REDIRECT,
  AUTH_LOGIN_ROUTE,
  getDefaultRouteByRole,
} from '@/shared/lib/auth';

import type { AuthRole, AuthSession, LoginCredentials } from './types';

const DEFAULT_DEMO_EMAIL = 'admin@mebel.kz';
const DEFAULT_DEMO_PASSWORD = 'admin12345';
const DEFAULT_CUSTOMER_DEMO_EMAIL = 'client@mebel.kz';
const DEFAULT_CUSTOMER_DEMO_PASSWORD = 'client12345';

type DemoAccount = {
  email: string;
  id: string;
  name: string;
  password: string;
  role: AuthRole;
};

export async function getAuthSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  return decodeAuthSession(value);
}

export function authenticateDemoUser(credentials: LoginCredentials): AuthSession | null {
  const email = credentials.email.trim().toLowerCase();
  const demo = getDemoAccounts().find(
    (account) => account.email.toLowerCase() === email && account.password === credentials.password,
  );

  if (!demo) {
    return null;
  }

  return {
    expiresAt: new Date(Date.now() + AUTH_COOKIE_MAX_AGE * 1000).toISOString(),
    user: {
      email: demo.email,
      id: demo.id,
      name: demo.name,
      role: demo.role,
    },
  };
}

export function setAuthCookie(response: NextResponse, session: AuthSession) {
  response.cookies.set(AUTH_COOKIE_NAME, encodeAuthSession(session), {
    httpOnly: true,
    maxAge: AUTH_COOKIE_MAX_AGE,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.set(AUTH_COOKIE_NAME, '', {
    httpOnly: true,
    maxAge: 0,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
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

export function getDemoCredentialsHint() {
  return getDemoAccounts().map((account) => ({
    email: account.email,
    label: account.role === 'customer' ? 'Обычный пользователь' : 'Администратор',
    password: isDemoPasswordFromEnv(account.role) ? undefined : account.password,
    role: account.role,
  }));
}

function getDemoAccounts(): DemoAccount[] {
  return [
    {
      email: process.env.AUTH_DEMO_EMAIL ?? DEFAULT_DEMO_EMAIL,
      id: 'demo-admin',
      name: 'Администратор',
      password: process.env.AUTH_DEMO_PASSWORD ?? DEFAULT_DEMO_PASSWORD,
      role: 'admin',
    },
    {
      email: process.env.AUTH_CUSTOMER_DEMO_EMAIL ?? DEFAULT_CUSTOMER_DEMO_EMAIL,
      id: 'demo-customer',
      name: 'Айгерим Садыкова',
      password: process.env.AUTH_CUSTOMER_DEMO_PASSWORD ?? DEFAULT_CUSTOMER_DEMO_PASSWORD,
      role: 'customer',
    },
  ];
}

function isDemoPasswordFromEnv(role: AuthRole) {
  if (role === 'customer') {
    return Boolean(process.env.AUTH_CUSTOMER_DEMO_PASSWORD);
  }

  return Boolean(process.env.AUTH_DEMO_PASSWORD);
}

function encodeAuthSession(session: AuthSession) {
  return Buffer.from(JSON.stringify(session), 'utf8').toString('base64url');
}

function decodeAuthSession(value: string | undefined): AuthSession | null {
  if (!value) {
    return null;
  }

  try {
    const session = JSON.parse(Buffer.from(value, 'base64url').toString('utf8')) as AuthSession;

    if (!session.expiresAt || Number.isNaN(Date.parse(session.expiresAt))) {
      return null;
    }

    if (Date.parse(session.expiresAt) <= Date.now()) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}
