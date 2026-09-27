import { NextRequest, NextResponse } from 'next/server';

import { clearAuthCookie, clearBackendAuthCookie } from '@/entities/auth/server';
import { API_BASE_URL } from '@/shared/api/config';
import { BACKEND_AUTH_COOKIE_NAME } from '@/shared/lib/auth';

export async function POST(request: NextRequest) {
  const backendSession = request.cookies.get(BACKEND_AUTH_COOKIE_NAME)?.value;

  if (backendSession) {
    await fetch(new URL('/auth/logout', normalizedApiBaseUrl()), {
      cache: 'no-store',
      headers: {
        Cookie: `${BACKEND_AUTH_COOKIE_NAME}=${backendSession}`,
        'X-CSRF-Protection': '1',
      },
      method: 'POST',
    }).catch(() => null);
  }

  const response = NextResponse.json({ ok: true });
  clearAuthCookie(response);
  clearBackendAuthCookie(response);

  return response;
}

function normalizedApiBaseUrl() {
  return API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
}
