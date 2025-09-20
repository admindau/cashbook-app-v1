
'use client';
import Protected from '@/components/Protected';
import Shell from '@/components/Shell';
import { add, load } from '@/lib/storage';
import { useMemo, useState } from 'react';
import { nanoid } from '@/lib/nanoid';
import { useToast } from '@/components/ToastProvider';
import type { Cur } from '@/lib/types';
import { symbolFor } from '@/lib/format';

export default function AddPage(){
  const toast = useToast();
  const data = useMemo(()=>load(), []);
  const [type, setType] = useState<'income'|'expense'>('expense');
  const [category, setCategory] = useState('Food');
  const [amount, setAmount] = useState<number>(0);
  const [currency, setCurrency] = useState<Cur>('SSP');
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0,10));
  const [note, setNote] = useState('');

  const submit = () => {
    const a = Number(amount);
    if (!Number.isFinite(a) || a <= 0) return alert('Amount must be greater than 0.');
    add({ id: nanoid(), type, category, amount: a, currency, date, note });
    setAmount(0); setNote('');
    toast.show('Transaction added successfully.');
  };

  return (
    <Protected>
      <Shell>
        <div className="flex items-center gap-2 mb-6">
          <img src="/logo.png" alt="Savvy Rilla Logo" className="h-8" />
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
              <select className="input mt-1" value={category} onChange={e=>setCategory(e.target.value)}>
                {(type==='income' ? data.categories.income : data.categories.expense).map(c=>(
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
            <div className="grid grid-cols-3 gap-3">
              <label className="block col-span-2">
                <span className="text-sm text-neutral-300">Amount ({symbolFor(currency)})</span>
                <input className="input mt-1" type="number" value={amount} onChange={e=>setAmount(parseFloat(e.target.value||'0'))}/>
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
              <input className="input mt-1" type="date" value={date} onChange={e=>setDate(e.target.value)}/>
            </label>
            <label className="block">
              <span className="text-sm text-neutral-300">Note (optional)</span>
              <input className="input mt-1" value={note} onChange={e=>setNote(e.target.value)} placeholder="e.g., transport to work"/>
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
