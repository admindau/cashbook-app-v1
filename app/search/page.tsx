'use client';
import Shell from '@/components/Shell';
import { load } from '@/lib/storage';
import { useMemo, useState } from 'react';
import { formatCurrency } from '@/lib/format';
export default function SearchPage(){
  const [q,setQ]=useState('');
  const data=useMemo(()=>load(),[q]);
  const results=useMemo(()=>{ if(!q) return []; const s=q.toLowerCase(); return data.transactions.filter(t=>(`${t.category} ${t.note||''} ${t.amount} ${t.type} ${t.date} ${t.currency}`).toLowerCase().includes(s)); },[data,q]);
  return (<Shell>
    <div className="flex items-center gap-2 mb-6">
      <img src="/logo.png" alt="Savvy Rilla Logo" className="h-8"/>
      <h2 className="text-lg font-semibold">Search</h2>
    </div>
    <div className="card max-w-2xl mx-auto">
      <input className="input" placeholder="Search terms..." value={q} onChange={e=>setQ(e.target.value)}/>
      <div className="mt-4 space-y-2">
        {results.map(r=>(
          <div key={r.id} className="flex justify-between border border-neutral-800 rounded-xl p-3">
            <div>
              <div className="text-sm text-neutral-400">{r.date} • {r.type} • {r.category} • {r.currency}</div>
              <div className="font-medium">{r.note}</div>
            </div>
            <div className="font-semibold">{formatCurrency(r.amount, r.currency)}</div>
          </div>
        ))}
        {q && results.length===0 && <div className="text-neutral-500">No results.</div>}
      </div>
    </div>
  </Shell>);
}
