'use client';
import Protected from '@/components/Protected';
import Shell from '@/components/Shell';
import Modal from '@/components/Modal';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ToastProvider';

type Cur = 'SSP'|'USD'|'KES';
type Cat = { id:string; name:string; type:'income'|'expense' };

export default function Settings(){
  const toast = useToast();
  const [uid, setUid] = useState('');
  const [email, setEmail] = useState('');
  const [curPwd, setCurPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [newPwd2, setNewPwd2] = useState('');
  const [usd, setUsd] = useState<number>(1500);
  const [kes, setKes] = useState<number>(10);
  const [amount, setAmount] = useState<number>(0);
  const [from, setFrom] = useState<Cur>('SSP');
  const [to, setTo] = useState<Cur>('USD');

  // Categories
  const [cats, setCats] = useState<{income:Cat[];expense:Cat[]}>({ income: [], expense: [] });
  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState<'income'|'expense'>('expense');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Cat | null>(null);
  const [confirmName, setConfirmName] = useState('');

  useEffect(()=>{
    const id = localStorage.getItem('cashbook:userId');
    if (id){
      setUid(id);
      fetch('/api/profile?userId='+id).then(r=>r.json()).then(j=>setEmail(j.email||''));
      fetch('/api/rates?userId='+id).then(r=>r.json()).then(j=>{ if (j){ setUsd(j.usdToSsp); setKes(j.kesToSsp); } });
      fetch('/api/categories').then(r=>r.json()).then(setCats);
    }
  },[]);

  const saveRates = async () => {
    await fetch('/api/rates', { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ userId: uid, usdToSsp: usd, kesToSsp: kes }) });
    toast.show('Exchange rates updated successfully.');
  };
  const saveEmail = async () => {
    await fetch('/api/profile', { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ userId: uid, email }) });
    toast.show('Email updated.');
  };
  const changePwd = async () => {
    if (newPwd !== newPwd2) return alert('New passwords do not match.');
    const r = await fetch('/api/profile', { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ userId: uid, currentPassword: curPwd, newPassword: newPwd }) });
    if (r.ok) { toast.show('Password changed successfully.'); setCurPwd(''); setNewPwd(''); setNewPwd2(''); }
    else alert('Incorrect current password.');
  };

  const convert = () => {
    let inSsp = amount;
    if (from==='USD') inSsp = amount * usd;
    if (from==='KES') inSsp = amount * kes;
    if (to==='USD') return inSsp / usd;
    if (to==='KES') return inSsp / kes;
    return inSsp;
  };

  const addCat = async () => {
    if (!newCatName.trim()) return;
    const r = await fetch('/api/categories', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name: newCatName.trim(), type: newCatType }) });
    if (r.ok){ setNewCatName(''); fetch('/api/categories').then(r=>r.json()).then(setCats); toast.show('Category added successfully.'); }
  };

  const openDelete = (c: Cat) => { setToDelete(c); setConfirmName(''); setConfirmOpen(true); };
  const doDelete = async () => {
    if (!toDelete) return;
    if (confirmName !== toDelete.name) return;
    await fetch('/api/categories/'+toDelete.id, { method:'DELETE' });
    setConfirmOpen(false); setToDelete(null);
    fetch('/api/categories').then(r=>r.json()).then(setCats);
    toast.show('Category and linked transactions deleted successfully.');
  };

  return (
    <Protected>
      <Shell>
        <div className="flex items-center gap-2 mb-6">
          <img src="/logo.png" className="h-8" alt="logo" />
          <h2 className="text-lg font-semibold">Settings</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-2">Profile</h3>
            <div className="grid gap-3">
              <label className="block">
                <span className="text-sm">Email</span>
                <input className="input mt-1" value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@example.com" />
              </label>
              <div className="flex gap-2">
                <button className="btn btn-primary" onClick={saveEmail}>Save Email</button>
              </div>
            </div>
            <div className="h-px my-4 bg-neutral-800" />
            <h4 className="font-semibold mb-2">Change Password</h4>
            <div className="grid gap-3">
              <input className="input" type="password" placeholder="Current password" value={curPwd} onChange={e=>setCurPwd(e.target.value)} />
              <input className="input" type="password" placeholder="New password" value={newPwd} onChange={e=>setNewPwd(e.target.value)} />
              <input className="input" type="password" placeholder="Confirm new password" value={newPwd2} onChange={e=>setNewPwd2(e.target.value)} />
              <button className="btn btn-primary" onClick={changePwd}>Change Password</button>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-2">Currency Exchange Rates</h3>
            <p className="text-sm text-neutral-400 mb-3">How many SSP equals 1 unit</p>
            <div className="grid gap-3">
              <label className="block">
                <span className="text-sm">1 USD = (SSP)</span>
                <input className="input mt-1" type="number" value={usd} onChange={e=>setUsd(parseFloat(e.target.value||'0'))} />
              </label>
              <label className="block">
                <span className="text-sm">1 KES = (SSP)</span>
                <input className="input mt-1" type="number" value={kes} onChange={e=>setKes(parseFloat(e.target.value||'0'))} />
              </label>
              <button className="btn btn-primary" onClick={saveRates}>Save Rates</button>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-2">Converter</h3>
            <div className="grid gap-3">
              <label className="block">
                <span className="text-sm text-neutral-300">Amount</span>
                <input className="input mt-1" type="number" value={amount} onChange={e=>setAmount(parseFloat(e.target.value||'0'))} />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-sm text-neutral-300">From</span>
                  <select className="input mt-1" value={from} onChange={e=>setFrom(e.target.value as Cur)}>
                    <option value="SSP">SSP</option>
                    <option value="USD">USD</option>
                    <option value="KES">KES</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm text-neutral-300">To</span>
                  <select className="input mt-1" value={to} onChange={e=>setTo(e.target.value as Cur)}>
                    <option value="SSP">SSP</option>
                    <option value="USD">USD</option>
                    <option value="KES">KES</option>
                  </select>
                </label>
              </div>
              <div className="mt-2 text-lg font-semibold">
                Result: {Number.isFinite(convert()) ? convert().toLocaleString(undefined, { maximumFractionDigits: 2 }) : '-'}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Manage Categories</h3>
            </div>
            <div className="grid gap-3">
              <div className="flex gap-2">
                <input className="input" placeholder="Category name" value={newCatName} onChange={e=>setNewCatName(e.target.value)} />
                <select className="input" value={newCatType} onChange={e=>setNewCatType(e.target.value as any)}>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
                <button className="btn btn-primary" onClick={addCat}>Add</button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Income</h4>
                  <div className="space-y-2">
                    {cats.income.map(c=>(
                      <div key={c.id} className="flex items-center justify-between border border-neutral-800 rounded-xl px-3 py-2">
                        <span>{c.name}</span>
                        <button className="btn text-red-400 border-red-700" onClick={()=>openDelete(c)}>Delete</button>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Expense</h4>
                  <div className="space-y-2">
                    {cats.expense.map(c=>(
                      <div key={c.id} className="flex items-center justify-between border border-neutral-800 rounded-xl px-3 py-2">
                        <span>{c.name}</span>
                        <button className="btn text-red-400 border-red-700" onClick={()=>openDelete(c)}>Delete</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-2">Danger Zone</h3>
            <p className="text-neutral-400 mb-3">This signs you out on this device.</p>
            <button className="btn bg-red-600 text-white" onClick={()=>{ localStorage.removeItem('cashbook:userId'); location.href='/login'; }}>Log out</button>
          </div>
        </div>

        <Modal
          isOpen={confirmOpen}
          onClose={()=>setConfirmOpen(false)}
          onConfirm={doDelete}
          title="Delete Category?"
          message={`Deleting this category will also delete all linked transactions. Type the category name to confirm.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
        >
          <input className="input" placeholder={toDelete?.name||'Category name'} value={confirmName} onChange={e=>setConfirmName(e.target.value)} />
          <p className="text-xs text-neutral-400 mt-2">This cannot be undone.</p>
          <script dangerouslySetInnerHTML={{__html:`
            (function(){
              const btn = document.currentScript.parentElement?.parentElement?.querySelector('button.bg-red-600');
              if (btn) { btn.disabled = ${toDelete? 'false':'false'}; }
            })();
          `}} />
        </Modal>
      </Shell>
    </Protected>
  );
}
