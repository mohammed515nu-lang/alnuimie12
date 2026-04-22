import { tryDemoLogin, resolveDemoSession } from '../../auth/demoAccounts';
import { api, getAuthToken, setAuthToken } from '../http';
import type { AuthUser } from '../types';

type LoginResponse = { token: string; user: AuthUser };
type RegisterResponse = LoginResponse;

function idToString(raw: unknown): string {
  if (raw == null) return '';
  if (typeof raw === 'string' || typeof raw === 'number') return String(raw);
  if (typeof raw === 'object' && 'toString' in raw && typeof (raw as { toString: () => string }).toString === 'function') {
    return String((raw as { toString: () => string }).toString());
  }
  return String(raw);
}

function normalizeUser(u: unknown): AuthUser {
  const anyU = u as { _id?: unknown; id?: unknown; name?: string; email?: string; role?: string; phone?: string };
  return {
    _id: idToString(anyU._id ?? anyU.id),
    name: String(anyU.name ?? ''),
    email: String(anyU.email ?? ''),
    role: String(anyU.role ?? 'client'),
    phone: anyU.phone,
  };
}

export const authAPI = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const demo = tryDemoLogin(email, password);
    if (demo) {
      await setAuthToken(demo.token);
      return { token: demo.token, user: demo.user };
    }
    const { data } = await api.post<LoginResponse>('/auth/login', { email, password });
    await setAuthToken(data.token);
    return { token: data.token, user: normalizeUser(data.user) };
  },

  async register(payload: {
    name: string;
    email: string;
    password: string;
    role: 'client' | 'contractor';
    phone?: string;
  }): Promise<RegisterResponse> {
    const { data } = await api.post<RegisterResponse>('/auth/register', payload);
    await setAuthToken(data.token);
    return { token: data.token, user: normalizeUser(data.user) };
  },

  async me(): Promise<AuthUser> {
    const token = await getAuthToken();
    const demoUser = resolveDemoSession(token);
    if (demoUser) return demoUser;
    const { data } = await api.get<{ user: unknown }>('/auth/me');
    return normalizeUser(data.user);
  },

  async logout() {
    await setAuthToken(null);
  },
};
