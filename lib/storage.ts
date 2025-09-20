
'use client';
import type { CashbookData, Transaction, Profile } from './types';

const KEY = 'cashbook:data:v6';
const AUTH_KEY = 'cashbook:auth';
const EMAIL_KEY = 'cashbook:email';
const SESSION_KEY = 'cashbook:session'; // 'active' | ''

export function getAuthHash(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_KEY);
}
export function setAuthHash(hash: string) {
  if (typeof window === 'undefined') return;
  if (hash) localStorage.setItem(AUTH_KEY, hash);
  else localStorage.removeItem(AUTH_KEY);
}
export function getEmail(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(EMAIL_KEY);
}
export function setEmail(email: string) {
  if (typeof window === 'undefined') return;
  if (email) localStorage.setItem(EMAIL_KEY, email);
  else localStorage.removeItem(EMAIL_KEY);
}
export function isSessionActive(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(SESSION_KEY) === 'active';
}
export function startSession() {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SESSION_KEY, 'active');
}
export function endSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
}

export function load(): CashbookData {
  if (typeof window === 'undefined') return defaultData();
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    const d = defaultData();
    localStorage.setItem(KEY, JSON.stringify(d));
    return d;
  }
  try { return JSON.parse(raw) as CashbookData; }
  catch {
    const d = defaultData();
    localStorage.setItem(KEY, JSON.stringify(d));
    return d;
  }
}

export function save(data: CashbookData) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(data));
  window.dispatchEvent(new StorageEvent('storage', { key: KEY } as any));
}

export function add(tx: Transaction) {
  const data = load();
  data.transactions.push(tx);
  save(data);
}

export function remove(id: string) {
  const data = load();
  data.transactions = data.transactions.filter(t => t.id !== id);
  save(data);
}

export function removeAll() {
  const data = load();
  data.transactions = [];
  save(data);
}

export function update(tx: Transaction) {
  const data = load();
  data.transactions = data.transactions.map(t => t.id === tx.id ? tx : t);
  save(data);
}

export function clearAll() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEY);
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(EMAIL_KEY);
  localStorage.removeItem(SESSION_KEY);
}

export function defaultData(): CashbookData {
  return {
    currency: 'SSP',
    categories: {
      income: ['Salary','Bonus','Investment','Gift'],
      expense: ['Food','Transport','Rent','Utilities','Health','Education','Leisure']
    },
    transactions: [],
    rates: { usd_to_ssp: 1500, kes_to_ssp: 10 }
  };
}

export function getProfile(): Profile {
  return { email: getEmail() };
}
