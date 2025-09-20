
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
  const [usdToSsp, setUsdToSsp] = useState<number>(data.rates.usd_to_ssp);
  const [kesToSsp, setKesToSsp] = useState<number>(data.rates.kes_to_ssp);

  const onReset = () => {
    clearAll();
    location.href = '/';
  };

  const saveRates = () => {
    if (usdToSsp <= 0 || kesToSsp <= 0) {
      alert('Rates must be greater than 0.');
      return;
    }
    data.rates.usd_to_ssp = usdToSsp;
    data.rates.kes_to_ssp = kesToSsp;
    save(data);
    toast.show('Exchange rates updated successfully.');
  };

  return (
    <Shell>
      <div className="flex items-center gap-2 mb-6">
        <img src="/logo.png" alt="Savvy Rilla Logo" className="h-8" />
        <h2 className="text-lg font-semibold">Settings</h2>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-2">Currency Exchange Rates</h2>
          <p className="text-sm text-neutral-400 mb-3">Define how many SSP equals 1 unit of each currency.</p>
          <div className="grid gap-3">
            <label className="block">
              <span className="text-sm">1 USD = (SSP)</span>
              <input className="input mt-1" type="number" value={usdToSsp} onChange={e=>setUsdToSsp(parseFloat(e.target.value||'0'))}/>
            </label>
            <label className="block">
              <span className="text-sm">1 KES = (SSP)</span>
              <input className="input mt-1" type="number" value={kesToSsp} onChange={e=>setKesToSsp(parseFloat(e.target.value||'0'))}/>
            </label>
            <button className="btn btn-primary" onClick={saveRates}>Save Rates</button>
          </div>
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
