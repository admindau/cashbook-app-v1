
'use client';
import Shell from '@/components/Shell';
import { load } from '@/lib/storage';
import { formatCurrency, symbolFor } from '@/lib/format';
import { useMemo, useState, useEffect } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Dashboard(){
  const [tick, setTick] = useState(0);
  const data = useMemo(()=>load(), [tick]);
  const symbol = symbolFor(data.currency);

  const totals = useMemo(()=>{
    const income = data.transactions.filter(t=>t.type==='income').reduce((a,b)=>a+b.amount,0);
    const expense = data.transactions.filter(t=>t.type==='expense').reduce((a,b)=>a+b.amount,0);
    return { income, expense, balance: income-expense };
  }, [data]);

  const byCategory = useMemo(()=>{
    const map: Record<string, number> = {};
    data.transactions.forEach(t=>{
      const key = `${t.type}:${t.category}`;
      map[key] = (map[key]||0) + t.amount;
    });
    return { labels: Object.keys(map), values: Object.values(map) };
  }, [data]);

  useEffect(()=>{
    const on = () => setTick(x=>x+1);
    window.addEventListener('storage', on);
    return ()=>window.removeEventListener('storage', on);
  },[]);

  return (
    <Shell>
      <div className="flex items-center gap-2 mb-6">
        <img src="/logo.png" alt="Savvy Rilla Logo" className="h-8" />
        <h2 className="text-lg font-semibold">Dashboard</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Stat title="Income" value={formatCurrency(totals.income, data.currency)} />
        <Stat title="Expense" value={formatCurrency(totals.expense, data.currency)} />
        <Stat title="Balance" value={formatCurrency(totals.balance, data.currency)} />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Totals by Type ({symbol})</h2>
          <Doughnut data={{
            labels: [`Income (${symbol})`, `Expense (${symbol})`],
            datasets: [{ data: [totals.income, totals.expense] }]
          }}/>
        </div>
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">By Category</h2>
          <Bar data={{
            labels: byCategory.labels,
            datasets: [{ label: `Amount (${symbol})`, data: byCategory.values }]
          }}
          options={{
            scales: {
              y: { ticks: { callback: (v)=> `${symbol} ${Number(v).toLocaleString()}` } }
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: (ctx)=> `${symbol} ${Number(ctx.parsed.y ?? ctx.parsed).toLocaleString()}`
                }
              }
            }
          }}
          />
        </div>
      </div>
    </Shell>
  );
}

function Stat({title, value}:{title:string; value:string}){
  return (
    <div className="card">
      <div className="text-sm text-neutral-400">{title}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}
