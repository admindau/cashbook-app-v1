
'use client';
import Protected from '@/components/Protected';
import Shell from '@/components/Shell';
import { load, remove, removeAll, update } from '@/lib/storage';
import { useMemo, useState } from 'react';
import type { Transaction } from '@/lib/types';
import Modal from '@/components/Modal';
import { useToast } from '@/components/ToastProvider';
import { Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/format';

export default function TransactionsPage(){
  const toast = useToast();
  const [q, setQ] = useState('');
  const [type, setType] = useState<'all'|'income'|'expense'>('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [selected, setSelected] = useState<Transaction|null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const data = useMemo(()=>load(), [q,type,from,to, showModal, showBulkModal]);

  const filtered = useMemo(()=>{
    return data.transactions
      .filter(t => (type==='all' || t.type===type))
      .filter(t => (!from || t.date >= from) && (!to || t.date <= to))
      .filter(t => {
        if (!q) return true;
        const s = `${t.category} ${t.note||''} ${t.amount} ${t.date} ${t.currency}`.toLowerCase();
        return s.includes(q.toLowerCase());
      })
      .sort((a,b)=> b.date.localeCompare(a.date));
  }, [data, q, type, from, to]);

  const onInlineEdit = (t: Transaction, field: keyof Transaction, value: string) => {
    const updated: Transaction = { ...t };
    if (field === 'amount') updated.amount = parseFloat(value || '0');
    else if (field === 'date') updated.date = value;
    else if (field === 'note') updated.note = value;
    update(updated);
  };

  const confirmDelete = (t: Transaction) => { setSelected(t); setShowModal(true); };
  const doDelete = () => {
    if (selected) {
      remove(selected.id);
      setShowModal(false);
      setSelected(null);
      toast.show('Transaction deleted successfully.');
    }
  };
  const doDeleteAll = () => {
    removeAll();
    setShowBulkModal(false);
    toast.show('All transactions deleted successfully.');
  };

  return (
    <Protected>
      <Shell>
        <div className="flex items-center gap-2 mb-6">
          <img src="/logo.png" alt="Savvy Rilla Logo" className="h-8" />
          <h2 className="text-lg font-semibold">Transactions</h2>
        </div>

        <div className="card">
          <div className="flex flex-wrap gap-2 items-end">
            <div className="grow">
              <label className="text-sm text-neutral-300">Search</label>
              <input className="input mt-1" placeholder="Find by note, category, amount..." value={q} onChange={e=>setQ(e.target.value)}/>
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
              <input type="date" className="input mt-1" value={from} onChange={e=>setFrom(e.target.value)}/>
            </div>
            <div>
              <label className="text-sm text-neutral-300">To</label>
              <input type="date" className="input mt-1" value={to} onChange={e=>setTo(e.target.value)}/>
            </div>
          </div>
        </div>

        {filtered.length>0 && (
          <div className="flex justify-end my-3">
            <button className="btn bg-red-600 text-white flex items-center gap-2" onClick={()=>setShowBulkModal(true)}>
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
              {filtered.map(t => (
                <tr key={t.id} className="hover:bg-neutral-900/40">
                  <td><input className="input" type="date" defaultValue={t.date} onBlur={e=>onInlineEdit(t,'date', e.target.value)}/></td>
                  <td><span className="badge">{t.type}</span></td>
                  <td>{t.category}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-400 text-sm">{formatCurrency(t.amount, t.currency)}</span>
                      <input className="input" type="number" defaultValue={t.amount} onBlur={e=>onInlineEdit(t,'amount', e.target.value)}/>
                    </div>
                  </td>
                  <td>{t.currency}</td>
                  <td><input className="input" defaultValue={t.note||''} onBlur={e=>onInlineEdit(t,'note', e.target.value)}/></td>
                  <td className="text-right">
                    <button title="Delete" className="p-2 rounded-lg border border-red-700 text-red-500 hover:bg-red-600/10" onClick={()=>confirmDelete(t)}>
                      <Trash2 className="h-4 w-4"/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length===0 && <div className="text-neutral-400 text-center py-6">No transactions to show.</div>}
        </div>

        <Modal
          isOpen={showModal}
          onClose={()=>setShowModal(false)}
          onConfirm={doDelete}
          title="Delete Transaction?"
          message="Are you sure you want to delete this transaction? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
        />
        <Modal
          isOpen={showBulkModal}
          onClose={()=>setShowBulkModal(false)}
          onConfirm={doDeleteAll}
          title="Delete All Transactions?"
          message="This will permanently delete all transactions. Are you sure?"
          confirmText="Delete All"
          cancelText="Cancel"
          variant="danger"
        />
      </Shell>
    </Protected>
  );
}
