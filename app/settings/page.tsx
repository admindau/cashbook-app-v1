
'use client';
import Protected from '@/components/Protected';
import { useState } from 'react';
import Shell from '@/components/Shell';
import Modal from '@/components/Modal';
import { clearAll, load, save, getProfile, setEmail, getAuthHash, setAuthHash } from '@/lib/storage';
import { useToast } from '@/components/ToastProvider';
import { sha256 } from '@/lib/auth';
import { convert } from '@/lib/rates';
import type { Cur } from '@/lib/types';
import { symbolFor } from '@/lib/format';

export default function SettingsPage(){
  const toast = useToast();
  const [showModal, setShowModal] = useState(false);
  const data = load();

  // Profile
  const profile = getProfile();
  const [email, setEmailState] = useState<string>(profile.email || '');
  const [curPwd, setCurPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [newPwd2, setNewPwd2] = useState('');

  // Rates
  const [usdToSsp, setUsdToSsp] = useState<number>(data.rates.usd_to_ssp);
  const [kesToSsp, setKesToSsp] = useState<number>(data.rates.kes_to_ssp);

  // Converter
  const [amount, setAmount] = useState<number>(0);
  const [from, setFrom] = useState<Cur>('SSP');
  const [to, setTo] = useState<Cur>('USD');
  const converted = convert(amount||0, from, to, data.rates);

  const saveRates = () => {
    if (usdToSsp <= 0 || kesToSsp <= 0) return alert('Rates must be greater than 0.');
    data.rates.usd_to_ssp = usdToSsp;
    data.rates.kes_to_ssp = kesToSsp;
    save(data);
    toast.show('Exchange rates updated successfully.');
  };

  const saveEmail = () => {
    if (!email || !email.includes('@')) return alert('Enter a valid email.');
    setEmail(email);
    toast.show('Email updated.');
  };

  const changePassword = async () => {
    if (!curPwd || !newPwd || !newPwd2) return alert('Fill all password fields.');
    if (newPwd !== newPwd2) return alert('New passwords do not match.');
    const hash = await sha256(curPwd);
    if (hash !== getAuthHash()) return alert('Current password is incorrect.');
    setAuthHash(await sha256(newPwd));
    toast.show('Password changed successfully.');
    setCurPwd(''); setNewPwd(''); setNewPwd2('');
  };

  const onReset = () => {
    clearAll();
    location.href = '/';
  };

  return (
    <Protected>
      <Shell>
        <div className="flex items-center gap-2 mb-6">
          <img src="/logo.png" alt="Savvy Rilla Logo" className="h-8" />
          <h2 className="text-lg font-semibold">Settings</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Profile */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-2">Profile</h3>
            <div className="grid gap-3">
              <label className="block">
                <span className="text-sm">Email</span>
                <input className="input mt-1" value={email} onChange={e=>setEmailState(e.target.value)} placeholder="name@example.com"/>
              </label>
              <div className="flex gap-2">
                <button className="btn btn-primary" onClick={saveEmail}>Save Email</button>
              </div>
            </div>
            <div className="h-px my-4 bg-neutral-800" />
            <h4 className="font-semibold mb-2">Change Password</h4>
            <div className="grid gap-3">
              <input className="input" type="password" placeholder="Current password" value={curPwd} onChange={e=>setCurPwd(e.target.value)}/>
              <input className="input" type="password" placeholder="New password" value={newPwd} onChange={e=>setNewPwd(e.target.value)}/>
              <input className="input" type="password" placeholder="Confirm new password" value={newPwd2} onChange={e=>setNewPwd2(e.target.value)}/>
              <button className="btn btn-primary" onClick={changePassword}>Change Password</button>
            </div>
          </div>

          {/* Exchange Rates */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-2">Currency Exchange Rates</h3>
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

          {/* Converter */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-2">Converter</h3>
            <div className="grid gap-3">
              <label className="block">
                <span className="text-sm text-neutral-300">Amount</span>
                <input className="input mt-1" type="number" value={amount} onChange={e=>setAmount(parseFloat(e.target.value||'0'))}/>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-sm text-neutral-300">From</span>
                  <select className="input mt-1" value={from} onChange={e=>setFrom(e.target.value as Cur)}>
                    <option value="SSP">SSP ({symbolFor('SSP')})</option>
                    <option value="USD">USD ({symbolFor('USD')})</option>
                    <option value="KES">KES ({symbolFor('KES')})</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm text-neutral-300">To</span>
                  <select className="input mt-1" value={to} onChange={e=>setTo(e.target.value as Cur)}>
                    <option value="SSP">SSP ({symbolFor('SSP')})</option>
                    <option value="USD">USD ({symbolFor('USD')})</option>
                    <option value="KES">KES ({symbolFor('KES')})</option>
                  </select>
                </label>
              </div>
              <div className="mt-2 text-lg font-semibold">
                Result: {Number.isFinite(converted) ? `${symbolFor(to)} ${converted.toLocaleString(undefined,{ maximumFractionDigits: 2 })}` : '-'}
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-2">Danger Zone</h3>
            <p className="text-neutral-400 mb-3">Reset all local data and settings.</p>
            <button className="btn bg-red-600 text-white" onClick={()=>setShowModal(true)}>Reset storage</button>
          </div>
        </div>

        <Modal
          isOpen={showModal}
          onClose={()=>setShowModal(false)}
          onConfirm={onReset}
          title="Reset Storage?"
          message="Are you sure you want to reset all storage? This will delete your records and credentials permanently."
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
        />
      </Shell>
    </Protected>
  );
}
