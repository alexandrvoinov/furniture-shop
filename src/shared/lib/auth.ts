export const AUTH_COOKIE_NAME = 'mebel_manager_session';
export const BACKEND_AUTH_COOKIE_NAME = 'session';
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
export const AUTH_ADMIN_REDIRECT = '/manager';
export const AUTH_CUSTOMER_REDIRECT = '/profile';
export const AUTH_DEFAULT_REDIRECT = '/cabinet';
export const AUTH_LOGIN_ROUTE = '/login';

export type SessionRole = 'admin' | 'customer' | 'manager';

export function getDefaultRouteByRole(role: SessionRole | undefined) {
  if (role === 'admin' || role === 'manager') {
    return AUTH_ADMIN_REDIRECT;
  }

  if (role === 'customer') {
    return AUTH_CUSTOMER_REDIRECT;
  }

  return AUTH_DEFAULT_REDIRECT;
}

export function isManagerRoute(pathname: string) {
  return pathname === AUTH_ADMIN_REDIRECT || pathname.startsWith(`${AUTH_ADMIN_REDIRECT}/`);
}

export function isProfileRoute(pathname: string) {
  return pathname === AUTH_CUSTOMER_REDIRECT || pathname.startsWith(`${AUTH_CUSTOMER_REDIRECT}/`);
}

export function isProtectedRoute(pathname: string) {
  return isManagerRoute(pathname) || isProfileRoute(pathname);
}
