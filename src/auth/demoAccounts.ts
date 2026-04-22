import type { AuthUser } from '../api/types';

/** تسجيل دخول بدون خادم — للتجربة والواجهات فقط */

export const DEMO_CONTRACTOR_EMAIL = 'mubani.contractor@demo';
export const DEMO_CLIENT_EMAIL = 'mubani.client@demo';
export const DEMO_PASSWORD = 'Demo1234';

const TOKEN_CONTRACTOR = 'bunyan-demo-contractor';
const TOKEN_CLIENT = 'bunyan-demo-client';

export const demoContractorUser: AuthUser = {
  _id: 'demo-user-contractor',
  name: 'مقاول تجريبي',
  email: DEMO_CONTRACTOR_EMAIL,
  role: 'contractor',
  phone: '0944000001',
};

export const demoClientUser: AuthUser = {
  _id: 'demo-user-client',
  name: 'عميل تجريبي',
  email: DEMO_CLIENT_EMAIL,
  role: 'client',
  phone: '0944000002',
};

export function resolveDemoSession(token: string | null | undefined): AuthUser | null {
  if (!token) return null;
  if (token === TOKEN_CONTRACTOR) return demoContractorUser;
  if (token === TOKEN_CLIENT) return demoClientUser;
  return null;
}

export function tryDemoLogin(email: string, password: string): { token: string; user: AuthUser } | null {
  const e = email.trim().toLowerCase();
  const p = password;
  if (p !== DEMO_PASSWORD) return null;
  if (e === DEMO_CONTRACTOR_EMAIL.toLowerCase()) {
    return { token: TOKEN_CONTRACTOR, user: demoContractorUser };
  }
  if (e === DEMO_CLIENT_EMAIL.toLowerCase()) {
    return { token: TOKEN_CLIENT, user: demoClientUser };
  }
  return null;
}

export function isDemoToken(token: string | null | undefined): boolean {
  return resolveDemoSession(token) != null;
}
