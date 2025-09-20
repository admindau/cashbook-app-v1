'use client';
import Protected from '@/components/Protected';
import Shell from '@/components/Shell';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ToastProvider';

type Cur = 'SSP'|'USD'|'KES';
type Cat = { id: string; name: string; type: 'income'|'expense' };

export default function AddPage(){
  const toast = useToast();
  const [uid, setUid] = useState('');
  const [cats, setCats] = useState<{income:Cat[];expense:Cat[]}>({ income: [], expense: [] });
  const [type, setType] = useState<'income'|'expense'>('expense');
  const [categoryId, setCategoryId] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [currency, setCurrency] = useState<Cur>('SSP');
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0,10));
  const [note, setNote] = useState('');

  useEffect(()=>{ const id = localStorage.getItem('cashbook:userId'); if (id) setUid(id); },[]);
  useEffect(()=>{ fetch('/api/categories').then(r=>r.json()).then(setCats); },[]);
  useEffect(()=>{
    const list = type==='income' ? cats.income : cats.expense;
    if (list.length && !list.find(c=>c.id===categoryId)) setCategoryId(list[0]?.id||'');
  }, [type, cats, categoryId]);

  const submit = async () => {
    if (!uid || !categoryId) return;
    const r = await fetch('/api/transactions', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ userId: uid, type, categoryId, amount: Number(amount), currency, date, note }) });
    if (r.ok){
      setAmount(0); setNote('');
      toast.show('Transaction added successfully.');
    }
  };

  const selectedList = type==='income' ? cats.income : cats.expense;

  return (
    <Protected>
      <Shell>
        <div className="flex items-center gap-2 mb-6">
          <img src="/logo.png" className="h-8" alt="logo" />
          <h2 className="text-lg font-semibold">Add Transaction</h2>
        </div>
        <div className="card max-w-xl">
          <div className="grid gap-4">
            <label className="block">
              <span className="text-sm text-neutral-300">Type</span>
              <select className="input mt-1" value={type} onChange={e=>setType(e.target.value as any)}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm text-neutral-300">Category</span>
              <select className="input mt-1" value={categoryId} onChange={e=>setCategoryId(e.target.value)}>
                {selectedList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>
            <div className="grid grid-cols-3 gap-3">
              <label className="block col-span-2">
                <span className="text-sm text-neutral-300">Amount</span>
                <input className="input mt-1" type="number" value={amount} onChange={e=>setAmount(parseFloat(e.target.value || '0'))} />
              </label>
              <label className="block">
                <span className="text-sm text-neutral-300">Currency</span>
                <select className="input mt-1" value={currency} onChange={e=>setCurrency(e.target.value as Cur)}>
                  <option value="SSP">SSP</option>
                  <option value="USD">USD</option>
                  <option value="KES">KES</option>
                </select>
              </label>
            </div>
            <label className="block">
              <span className="text-sm text-neutral-300">Date</span>
              <input className="input mt-1" type="date" value={date} onChange={e=>setDate(e.target.value)} />
            </label>
            <label className="block">
              <span className="text-sm text-neutral-300">Note (optional)</span>
              <input className="input mt-1" value={note} onChange={e=>setNote(e.target.value)} placeholder="e.g., transport to work" />
            </label>
            <div className="flex gap-2 pt-2">
              <button className="btn btn-primary" onClick={submit}>Save</button>
            </div>
          </div>
        </div>
      </Shell>
    </Protected>
  );
}
