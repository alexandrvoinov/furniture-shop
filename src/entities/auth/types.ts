export type AuthRole = 'admin' | 'customer' | 'manager';

export type AuthUser = {
  email: string;
  id: string;
  isActive?: boolean;
  name: string;
  phone?: string;
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

export type BackendAuthUser = {
  created_at: string;
  email: string;
  id: number;
  is_active: boolean;
  name: string;
  phone: string;
  role: AuthRole;
};
