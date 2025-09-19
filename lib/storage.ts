
'use client';
import type { CashbookData, Transaction, TxType } from './types';

const KEY = 'cashbook:data:v1';
const AUTH_KEY = 'cashbook:auth';
const THEME_KEY = 'cashbook:theme';

export function getTheme(): 'dark'|'light' {
  if (typeof window === 'undefined') return 'dark';
  return (localStorage.getItem(THEME_KEY) as any) || 'dark';
}
export function setTheme(t: 'dark'|'light') {
  if (typeof window === 'undefined') return;
  localStorage.setItem(THEME_KEY, t);
}

export function getAuthHash(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_KEY);
}
export function setAuthHash(hash: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_KEY, hash);
}
export function clearAuth() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_KEY);
}

export function load(): CashbookData {
  if (typeof window === 'undefined') {
    return defaultData();
  }
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    const d = defaultData();
    localStorage.setItem(KEY, JSON.stringify(d));
    return d;
  }
  try {
    return JSON.parse(raw) as CashbookData;
  } catch {
    const d = defaultData();
    localStorage.setItem(KEY, JSON.stringify(d));
    return d;
  }
}

export function save(data: CashbookData) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(data));
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

export function update(tx: Transaction) {
  const data = load();
  data.transactions = data.transactions.map(t => t.id === tx.id ? tx : t);
  save(data);
}

export function clearAll() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEY);
}

export function defaultData(): CashbookData {
  return {
    currency: 'SSP',
    categories: {
      income: ['Salary','Bonus','Investment','Gift'],
      expense: ['Food','Transport','Rent','Utilities','Health','Education','Leisure']
    },
    transactions: []
  };
}

export function exportCSV(): string {
  const data = load();
  const rows = [
    ['id','date','type','category','amount','note'],
    ...data.transactions.map(t => [t.id, t.date, t.type, t.category, t.amount.toString(), t.note || ''])
  ];
  return rows.map(r => r.map(v => `"${String(v).replaceAll('"','""')}"`).join(',')).join('\n');
}
