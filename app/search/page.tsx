
'use client';
import Shell from '@/components/Shell';
import { load } from '@/lib/storage';
import { useMemo, useState } from 'react';

export default function SearchPage(){
  const [q, setQ] = useState('');
  const data = useMemo(()=>load(), [q]);
  const results = useMemo(()=>{
    if (!q) return [];
    const s = q.toLowerCase();
    return data.transactions.filter(t => (`${t.category} ${t.note||''} ${t.amount} ${t.type} ${t.date}`).toLowerCase().includes(s));
  },[data, q]);

  return (
    <Shell>
      <div className="card max-w-2xl mx-auto">
        <h1 className="text-xl font-semibold mb-3">Search</h1>
        <input className="input" placeholder="Search terms..." value={q} onChange={e=>setQ(e.target.value)}/>
        <div className="mt-4 space-y-2">
          {results.map(r=>(
            <div key={r.id} className="flex justify-between border border-neutral-800 rounded-xl p-3">
              <div>
                <div className="text-sm text-neutral-400">{r.date} • {r.type} • {r.category}</div>
                <div className="font-medium">{r.note}</div>
              </div>
              <div className="font-semibold">{data.currency} {r.amount.toLocaleString()}</div>
            </div>
          ))}
          {q && results.length===0 && <div className="text-neutral-500">No results.</div>}
        </div>
      </div>
    </Shell>
  );
}
