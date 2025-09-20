
'use client';
import { useState } from 'react';
import Shell from '@/components/Shell';
import Modal from '@/components/Modal';
import { clearAll, load, save } from '@/lib/storage';
import { useToast } from '@/components/ToastProvider';

export default function SettingsPage(){
  const toast = useToast();
  const [showModal, setShowModal] = useState(false);
  const data = load();
  const [currency, setCurrency] = useState(data.currency);

  const onReset = () => {
    clearAll();
    location.href = '/';
  };

  const changeCurrency = () => {
    data.currency = currency;
    save(data);
    toast.show('Currency updated.');
  };

  return (
    <Shell>
      <div className="flex items-center gap-2 mb-6">
        <img src="/logo.png" alt="Savvy Rilla Logo" className="h-8" />
        <h2 className="text-lg font-semibold">Settings</h2>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-2">Currency</h2>
          <select className="input" value={currency} onChange={e=>setCurrency(e.target.value)}>
            <option value="SSP">SSP</option>
            <option value="KES">KES</option>
            <option value="USD">USD</option>
          </select>
          <button className="btn mt-2" onClick={changeCurrency}>Save Currency</button>
        </div>
        <div className="card">
          <h2 className="text-lg font-semibold mb-2">Danger Zone</h2>
          <p className="text-neutral-400 mb-3">Reset all local data and settings.</p>
          <button className="btn bg-red-600 text-white" onClick={()=>setShowModal(true)}>Reset storage</button>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={()=>setShowModal(false)}
        onConfirm={onReset}
        title="Reset Storage?"
        message="Are you sure you want to reset all storage? This will delete your records permanently."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </Shell>
  );
}
