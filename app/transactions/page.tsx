'use client';
import Protected from '@/components/Protected';
import Shell from '@/components/Shell';
import { useEffect, useMemo, useState } from 'react';
import Modal from '@/components/Modal';
import { useToast } from '@/components/ToastProvider';
import { Trash2 } from 'lucide-react';

export default function TransactionsPage(){
  const toast = useToast();
  const [uid, setUid] = useState('');
  const [list, setList] = useState<any[]>([]);
  const [q, setQ] = useState('');
  const [type, setType] = useState<'all'|'income'|'expense'>('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [sel, setSel] = useState<any|null>(null);
  const [show, setShow] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const load = () => { if (uid) fetch('/api/transactions?userId='+uid).then(r=>r.json()).then(setList); };
  useEffect(()=>{ const id = localStorage.getItem('cashbook:userId'); if (id){ setUid(id); } },[]);
  useEffect(()=>{ load(); },[uid, show, showAll]);

  const filtered = useMemo(()=>{
    return list
      .filter((t:any)=> (type==='all' || t.type===type))
      .filter((t:any)=> (!from || t.date.slice(0,10) >= from) && (!to || t.date.slice(0,10) <= to))
      .filter((t:any)=>{
        if (!q) return true;
        const s = `${t.category?.name||''} ${t.note||''} ${t.amount} ${t.date} ${t.currency}`.toLowerCase();
        return s.includes(q.toLowerCase());
      })
      .sort((a:any,b:any)=> b.date.localeCompare(a.date));
  }, [list, q, type, from, to]);

  const delOne = async () => {
    if (sel){
      await fetch('/api/transactions/'+sel.id, { method:'DELETE' });
      setShow(false); setSel(null);
      toast.show('Transaction deleted successfully.');
      load();
    }
  };
  const delAll = async () => {
    for (const t of filtered){
      await fetch('/api/transactions/'+t.id, { method:'DELETE' });
    }
    setShowAll(false);
    toast.show('All transactions deleted successfully.');
    load();
  };

  return (
    <Protected>
      <Shell>
        <div className="flex items-center gap-2 mb-6">
          <img src="/logo.png" className="h-8" alt="logo" />
          <h2 className="text-lg font-semibold">Transactions</h2>
        </div>

        <div className="card">
          <div className="flex flex-wrap gap-2 items-end">
            <div className="grow">
              <label className="text-sm text-neutral-300">Search</label>
              <input className="input mt-1" placeholder="Find by note, category, amount..." value={q} onChange={e=>setQ(e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-neutral-300">Type</label>
              <select className="input mt-1" value={type} onChange={e=>setType(e.target.value as any)}>
                <option value="all">All</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-neutral-300">From</label>
              <input type="date" className="input mt-1" value={from} onChange={e=>setFrom(e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-neutral-300">To</label>
              <input type="date" className="input mt-1" value={to} onChange={e=>setTo(e.target.value)} />
            </div>
          </div>
        </div>

        {filtered.length>0 and (
          <div className="flex justify-end my-3">
            <button className="btn bg-red-600 text-white flex items-center gap-2" onClick={()=>setShowAll(true)}>
              <Trash2 className="h-4 w-4" /> Delete All Transactions
            </button>
          </div>
        )}

        <div className="card overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Currency</th>
                <th>Note</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t:any)=>(
                <tr key={t.id} className="hover:bg-neutral-900/40">
                  <td>{t.date.slice(0,10)}</td>
                  <td><span className="badge">{t.type}</span></td>
                  <td>{t.category?.name||'—'}</td>
                  <td>{Number(t.amount).toLocaleString()}</td>
                  <td>{t.currency}</td>
                  <td>{t.note||''}</td>
                  <td className="text-right">
                    <button title="Delete" className="p-2 rounded-lg border border-red-700 text-red-500 hover:bg-red-600/10" onClick={()=>{ setSel(t); setShow(true); }}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length===0 && <div className="text-neutral-400 text-center py-6">No transactions to show.</div>}
        </div>

        <Modal isOpen={show} onClose={()=>setShow(false)} onConfirm={delOne} title="Delete Transaction?" message="Are you sure you want to delete this transaction?" confirmText="Delete" cancelText="Cancel" variant="danger" />
        <Modal isOpen={showAll} onClose={()=>setShowAll(false)} onConfirm={delAll} title="Delete All Transactions?" message="This will permanently delete all transactions in the current filter." confirmText="Delete All" cancelText="Cancel" variant="danger" />
      </Shell>
    </Protected>
  );
}
