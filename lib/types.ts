
export type TxType = 'income' | 'expense';
export type Cur = 'SSP' | 'USD' | 'KES';

export interface Transaction {
  id: string;
  date: string;
  type: TxType;
  category: string;
  amount: number;
  currency: Cur;
  note?: string;
}

export interface Rates {
  usd_to_ssp: number; // 1 USD equals X SSP
  kes_to_ssp: number; // 1 KES equals Y SSP
}

export interface CashbookData {
  transactions: Transaction[];
  currency: Cur; // default preference (kept for compatibility)
  categories: { income: string[]; expense: string[] };
  rates: Rates;
}
