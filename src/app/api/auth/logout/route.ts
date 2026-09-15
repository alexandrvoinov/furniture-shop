import { NextResponse } from 'next/server';

import { clearAuthCookie } from '@/entities/auth/server';

export async function POST() {
  const response = NextResponse.json({ ok: true });
  clearAuthCookie(response);

  return response;
}
