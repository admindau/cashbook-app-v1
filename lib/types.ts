
export type TxType = 'income' | 'expense';

export interface Transaction {
  id: string;
  date: string; // ISO date
  type: TxType;
  category: string;
  amount: number;
  note?: string;
}

export interface CashbookData {
  transactions: Transaction[];
  currency: string;
  categories: { income: string[]; expense: string[] };
}
