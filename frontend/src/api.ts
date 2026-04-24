import { v4 as uuidv4 } from 'uuid';

const API_BASE = import.meta.env.VITE_API_BASE;

export interface Expense {
  id: number;
  amount: number; // in cents
  category: string;
  description: string;
  date: string;
  created_at: string;
}

const getHeaders = (idempotencyKey?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (idempotencyKey) headers['x-idempotency-key'] = idempotencyKey;
  return headers;
}

export const checkAuth = async () => {
  const res = await fetch(`${API_BASE}/auth/me`, { credentials: 'include' });
  if (!res.ok) throw new Error('Not authenticated');
  return res.json();
}

export const logoutApi = async () => {
  const res = await fetch(`${API_BASE}/auth/logout`, { method: 'POST', credentials: 'include' });
  return res.json();
}

export const fetchExpenses = async (category?: string, sort?: string): Promise<Expense[]> => {
  const url = new URL(`${API_BASE}/expenses`);
  if (category && category !== 'All') url.searchParams.append('category', category);
  if (sort) url.searchParams.append('sort', sort);

  const res = await fetch(url.toString(), { headers: getHeaders(), credentials: 'include' });
  if (!res.ok) {
    if (res.status === 401) {
      window.location.reload();
    }
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to fetch expenses');
  }
  return res.json();
};

export const createExpense = async (data: Omit<Expense, 'id' | 'created_at'>): Promise<Expense> => {
  const idempotencyKey = uuidv4();
  const res = await fetch(`${API_BASE}/expenses`, {
    method: 'POST',
    headers: getHeaders(idempotencyKey),
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    if (res.status === 401) {
      window.location.reload();
    }
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create expense');
  }
  return res.json();
};

export const login = async (data: any) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to login');
  }
  return res.json();
}

export const signup = async (data: any) => {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to signup');
  }
  return res.json();
}
