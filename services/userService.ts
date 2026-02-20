import api from './api';

export interface User {
  id: number;
  name: string;
  email?: string;
  specialty?: string;
  avatar?: string;
  [key: string]: any;
}

export async function getMe(): Promise<User> {
  const res = await api.get('/me');
  return res.data;
}

export function getLocalUser(): User | null {
  try {
    const u = localStorage.getItem('user');
    return u ? (JSON.parse(u) as User) : null;
  } catch {
    return null;
  }
}

export function clearAuth(): void {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  } catch {
    // ignore
  }
}
