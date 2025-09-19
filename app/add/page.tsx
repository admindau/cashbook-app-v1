
'use client';
import Shell from '@/components/Shell';
import { add, load } from '@/lib/storage';
import { useMemo, useState } from 'react';
import { nanoid } from '@/lib/nanoid';
import { useRouter } from 'next/navigation';

export default function AddPage(){
  const router = useRouter();
  const data = useMemo(()=>load(), []);
  const [type, setType] = useState<'income'|'expense'>('expense');
  const [category, setCategory] = useState('Food');
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0,10));
  const [note, setNote] = useState('');

  const submit = () => {
    if (amount <= 0) return alert('Amount must be greater than 0.');
    add({ id: nanoid(), type, category, amount, date, note });
    router.push('/transactions');
  };

  return (
    <Shell>
      <div className="card max-w-xl mx-auto">
        <h1 className="text-xl font-semibold mb-4">Add Transaction</h1>
        <div className="grid gap-4">
          <label className="block">
            <span className="text-sm text-neutral-300">Type</span>
            <select className="select mt-1" value={type} onChange={e=>setType(e.target.value as any)}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm text-neutral-300">Category</span>
            <select className="select mt-1" value={category} onChange={e=>setCategory(e.target.value)}>
              {(type==='income' ? data.categories.income : data.categories.expense).map(c=>(
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm text-neutral-300">Amount</span>
            <input className="input mt-1" type="number" value={amount} onChange={e=>setAmount(parseFloat(e.target.value))}/>
          </label>
          <label className="block">
            <span className="text-sm text-neutral-300">Date</span>
            <input className="input mt-1" type="date" value={date} onChange={e=>setDate(e.target.value)}/>
          </label>
          <label className="block">
            <span className="text-sm text-neutral-300">Note (optional)</span>
            <input className="input mt-1" value={note} onChange={e=>setNote(e.target.value)} placeholder="e.g., boda to work"/>
          </label>
          <div className="flex gap-2 pt-2">
            <button className="btn btn-primary" onClick={submit}>Save</button>
          </div>
        </div>
      </div>
    </Shell>
  );
}
