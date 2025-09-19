
'use client';
import Shell from '@/components/Shell';
import { load, remove, update } from '@/lib/storage';
import { useMemo, useState } from 'react';
import type { Transaction } from '@/lib/types';
import { useRouter } from 'next/navigation';

export default function TransactionsPage(){
  const router = useRouter();
  const [q, setQ] = useState('');
  const [type, setType] = useState<'all'|'income'|'expense'>('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const data = useMemo(()=>load(), [q,type,from,to]);

  const filtered = useMemo(()=>{
    return data.transactions
      .filter(t => (type==='all' || t.type===type))
      .filter(t => (!from || t.date >= from) && (!to || t.date <= to))
      .filter(t => {
        if (!q) return true;
        const s = `${t.category} ${t.note||''} ${t.amount} ${t.date}`.toLowerCase();
        return s.includes(q.toLowerCase());
      })
      .sort((a,b)=> b.date.localeCompare(a.date));
  }, [data, q, type, from, to]);

  const onDelete = (id: string) => {
    if (confirm('Delete this transaction?')) {
      remove(id);
      router.refresh();
    }
  };

  const onInlineEdit = (t: Transaction, field: keyof Transaction, value: string) => {
    const updated: Transaction = { ...t };
    if (field === 'amount') updated.amount = parseFloat(value || '0');
    else if (field === 'date') updated.date = value;
    else if (field === 'note') updated.note = value;
    update(updated);
    router.refresh();
  };

  return (
    <Shell>
      <div className="card">
        <div className="flex flex-wrap gap-2 items-end">
          <div className="grow">
            <label className="text-sm text-neutral-300">Search</label>
            <input className="input mt-1" placeholder="Find by note, category, amount..." value={q} onChange={e=>setQ(e.target.value)}/>
          </div>
          <div>
            <label className="text-sm text-neutral-300">Type</label>
            <select className="select mt-1" value={type} onChange={e=>setType(e.target.value as any)}>
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-neutral-300">From</label>
            <input type="date" className="input mt-1" value={from} onChange={e=>setFrom(e.target.value)}/>
          </div>
          <div>
            <label className="text-sm text-neutral-300">To</label>
            <input type="date" className="input mt-1" value={to} onChange={e=>setTo(e.target.value)}/>
          </div>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Note</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.id} className="hover:bg-neutral-900/40">
                <td><input className="input" type="date" defaultValue={t.date} onBlur={e=>onInlineEdit(t,'date', e.target.value)}/></td>
                <td><span className="badge">{t.type}</span></td>
                <td>{t.category}</td>
                <td><input className="input" type="number" defaultValue={t.amount} onBlur={e=>onInlineEdit(t,'amount', e.target.value)}/></td>
                <td><input className="input" defaultValue={t.note||''} onBlur={e=>onInlineEdit(t,'note', e.target.value)}/></td>
                <td><button className="btn" onClick={()=>onDelete(t.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length===0 && <div className="text-neutral-400 text-center py-6">No transactions to show.</div>}
      </div>
    </Shell>
  );
}
