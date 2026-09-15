export type AuthRole = 'admin' | 'customer' | 'manager';

export type AuthUser = {
  email: string;
  id: string;
  name: string;
  role: AuthRole;
};

export type AuthSession = {
  expiresAt: string;
  user: AuthUser;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type LoginResponse = {
  session: AuthSession;
};
