
'use client';
import Protected from '@/components/Protected';import Shell from '@/components/Shell';import { load } from '@/lib/storage';import { formatCurrency, symbolFor } from '@/lib/format';
import { useMemo, useState, useEffect } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);
export default function Dashboard(){const [tick,setTick]=useState(0);const data=useMemo(()=>load(),[tick]);
const totalsByCurrency=useMemo(()=>{const m:any={};data.transactions.forEach(t=>{if(!m[t.currency])m[t.currency]={income:0,expense:0};m[t.currency][t.type]+=t.amount;});return m;},[data]);
const byCategory=useMemo(()=>{const m:any={};data.transactions.forEach(t=>{const k=`${t.currency}:${t.type}:${t.category}`;m[k]=(m[k]||0)+t.amount;});return m;},[data]);
useEffect(()=>{const on=()=>setTick(x=>x+1);window.addEventListener('storage',on as any);return()=>window.removeEventListener('storage',on as any);},[]);
const doughnutLabels:string[]=[];const doughnutValues:number[]=[];Object.entries(totalsByCurrency).forEach(([cur,vals]:any)=>{doughnutLabels.push(`Income (${symbolFor(cur)})`);doughnutValues.push(vals.income);doughnutLabels.push(`Expense (${symbolFor(cur)})`);doughnutValues.push(vals.expense);});
return(<Protected><Shell><div className="flex items-center gap-2 mb-6"><img src="/logo.png" className="h-8" alt="logo"/><h2 className="text-lg font-semibold">Dashboard</h2></div>
<div className="grid md:grid-cols-3 gap-4">{Object.entries(totalsByCurrency).map(([cur,v]:any)=>(<div key={cur} className="card"><div className="text-sm text-neutral-400">Income ({cur})</div><div className="text-2xl font-semibold">{formatCurrency(v.income,cur)}</div><div className="text-sm text-neutral-400 mt-3">Expense ({cur})</div><div className="text-2xl font-semibold">{formatCurrency(v.expense,cur)}</div><div className="text-sm text-neutral-400 mt-3">Balance ({cur})</div><div className="text-2xl font-semibold">{formatCurrency(v.income-v.expense,cur)}</div></div>))}{Object.keys(totalsByCurrency).length===0 && <div className="card">No data yet.</div>}</div>
<div className="grid md:grid-cols-2 gap-6 mt-6"><div className="card"><h2 className="text-lg font-semibold mb-4">Totals by Type (native)</h2><Doughnut data={{labels:doughnutLabels,datasets:[{data:doughnutValues}]}}/></div><div className="card"><h2 className="text-lg font-semibold mb-4">By Category</h2><Bar data={{labels:Object.keys(byCategory),datasets:[{label:'Amount (native)',data:Object.values(byCategory)}]}}/></div></div>
</Shell></Protected>);}
