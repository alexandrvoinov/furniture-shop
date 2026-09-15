import { NextRequest, NextResponse } from 'next/server';

import { authenticateDemoUser, setAuthCookie } from '@/entities/auth/server';
import type { LoginCredentials } from '@/entities/auth/types';

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as Partial<LoginCredentials> | null;

  if (!body || typeof body.email !== 'string' || typeof body.password !== 'string') {
    return NextResponse.json({ message: 'Введите email и пароль' }, { status: 400 });
  }

  const session = authenticateDemoUser({
    email: body.email,
    password: body.password,
  });

  if (!session) {
    return NextResponse.json({ message: 'Неверный email или пароль' }, { status: 401 });
  }

  const response = NextResponse.json({ session });
  setAuthCookie(response, session);

  return response;
}
