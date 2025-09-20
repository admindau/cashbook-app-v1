
'use client';
import type { CashbookData, Transaction, Profile } from './types';
const KEY='cashbook:data:v5';const AUTH_KEY='cashbook:auth';const EMAIL_KEY='cashbook:email';const SESSION_KEY='cashbook:session';
export function getAuthHash(){if(typeof window==='undefined')return null;return localStorage.getItem(AUTH_KEY);}
export function setAuthHash(hash:string){if(typeof window==='undefined')return; if(hash)localStorage.setItem(AUTH_KEY,hash);else localStorage.removeItem(AUTH_KEY);}
export function getEmail(){if(typeof window==='undefined')return null;return localStorage.getItem(EMAIL_KEY);}
export function setEmail(email:string){if(typeof window==='undefined')return; if(email)localStorage.setItem(EMAIL_KEY,email);else localStorage.removeItem(EMAIL_KEY);}
export function isSessionActive(){if(typeof window==='undefined')return false;return localStorage.getItem(SESSION_KEY)==='active';}
export function startSession(){if(typeof window==='undefined')return;localStorage.setItem(SESSION_KEY,'active');}
export function endSession(){if(typeof window==='undefined')return;localStorage.removeItem(SESSION_KEY);}
export function load():CashbookData{if(typeof window==='undefined')return def();const raw=localStorage.getItem(KEY);if(!raw){const d=def();localStorage.setItem(KEY,JSON.stringify(d));return d;}try{return JSON.parse(raw) as CashbookData;}catch{const d=def();localStorage.setItem(KEY,JSON.stringify(d));return d;}}
export function save(data:CashbookData){if(typeof window==='undefined')return;localStorage.setItem(KEY,JSON.stringify(data));window.dispatchEvent(new StorageEvent('storage',{key:KEY} as any));}
export function add(tx:Transaction){const d=load();d.transactions.push(tx);save(d);}
export function remove(id:string){const d=load();d.transactions=d.transactions.filter(t=>t.id!==id);save(d);}
export function removeAll(){const d=load();d.transactions=[];save(d);}
export function update(tx:Transaction){const d=load();d.transactions=d.transactions.map(t=>t.id===tx.id?tx:t);save(d);}
export function clearAll(){if(typeof window==='undefined')return;localStorage.removeItem(KEY);localStorage.removeItem(AUTH_KEY);localStorage.removeItem(EMAIL_KEY);localStorage.removeItem(SESSION_KEY);}
export function def():CashbookData{return{currency:'SSP',categories:{income:['Salary','Bonus','Investment','Gift'],expense:['Food','Transport','Rent','Utilities','Health','Education','Leisure']},transactions:[],rates:{usd_to_ssp:1500,kes_to_ssp:10}};}
export function getProfile():Profile{return{email:getEmail()};}
