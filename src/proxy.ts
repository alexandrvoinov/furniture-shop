import { NextRequest, NextResponse } from 'next/server';

import {
  AUTH_COOKIE_NAME,
  AUTH_DEFAULT_REDIRECT,
  AUTH_CUSTOMER_REDIRECT,
  AUTH_LOGIN_ROUTE,
  getDefaultRouteByRole,
  isManagerRoute,
  isProtectedRoute,
} from '@/shared/lib/auth';

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const session = readSessionCookie(request.cookies.get(AUTH_COOKIE_NAME)?.value);
  const hasSession = Boolean(session);

  if (isProtectedRoute(pathname) && !hasSession) {
    const loginUrl = new URL(AUTH_LOGIN_ROUTE, request.url);
    loginUrl.searchParams.set('next', `${pathname}${search}`);

    return NextResponse.redirect(loginUrl);
  }

  if (isManagerRoute(pathname) && session?.role === 'customer') {
    return NextResponse.redirect(new URL(AUTH_CUSTOMER_REDIRECT, request.url));
  }

  if (pathname === AUTH_LOGIN_ROUTE && hasSession) {
    return NextResponse.redirect(
      new URL(getDefaultRouteByRole(session?.role) || AUTH_DEFAULT_REDIRECT, request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/manager/:path*', '/profile/:path*', '/login'],
};

function readSessionCookie(
  value: string | undefined,
): { role?: 'admin' | 'customer' | 'manager' } | null {
  if (!value) {
    return null;
  }

  try {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const session = JSON.parse(atob(padded)) as {
      expiresAt?: string;
      user?: { role?: 'admin' | 'customer' | 'manager' };
    };

    if (!session.expiresAt || Date.parse(session.expiresAt) <= Date.now()) {
      return null;
    }

    return { role: session.user?.role };
  } catch {
    return null;
  }
}
