
'use client';
import Shell from '@/components/Shell';
import { load } from '@/lib/storage';
import { useEffect, useMemo, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Dashboard(){
  const [refresh, setRefresh] = useState(0);
  const data = useMemo(()=>load(), [refresh]);
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
    const labels = Object.keys(map);
    const values = Object.values(map);
    return { labels, values };
  }, [data]);

  useEffect(()=>{
    const on = () => setRefresh(x=>x+1);
    window.addEventListener('storage', on);
    return ()=>window.removeEventListener('storage', on);
  },[]);

  return (
    <Shell>
      <div className="grid md:grid-cols-3 gap-4">
        <Stat title="Income" value={`${data.currency} ${totals.income.toLocaleString()}`} />
        <Stat title="Expense" value={`${data.currency} ${totals.expense.toLocaleString()}`} />
        <Stat title="Balance" value={`${data.currency} ${totals.balance.toLocaleString()}`} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Totals by Type</h2>
          <Doughnut data={{
            labels: ['Income','Expense'],
            datasets: [{ data: [totals.income, totals.expense] }]
          }}/>
        </div>
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">By Category</h2>
          <Bar data={{
            labels: byCategory.labels,
            datasets: [{ label: 'Amount', data: byCategory.values }]
          }}/>
        </div>
      </div>
    </Shell>
  )
}

function Stat({title, value}:{title:string; value:string}){
  return (
    <div className="card">
      <div className="text-sm text-neutral-400">{title}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}
