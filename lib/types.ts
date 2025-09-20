
export type TxType='income'|'expense';
export type Cur='SSP'|'USD'|'KES';
export interface Transaction{ id:string; date:string; type:TxType; category:string; amount:number; currency:Cur; note?:string; }
export interface Rates{ usd_to_ssp:number; kes_to_ssp:number; }
export interface CashbookData{ transactions:Transaction[]; currency:Cur; categories:{income:string[];expense:string[]}; rates:Rates; }
export interface Profile{ email:string|null; }
