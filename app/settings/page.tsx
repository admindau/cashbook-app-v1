
'use client';
import Shell from '@/components/Shell';
import { clearAll, setAuthHash } from '@/lib/storage';
import { useState } from 'react';
import { sha256 } from '@/lib/auth';

export default function SettingsPage(){
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [msg, setMsg] = useState('');

  const changePassword = async () => {
    if (p1.length<4 || p1!==p2) return setMsg('Passwords must match and be >= 4 chars.');
    setAuthHash(await sha256(p1));
    setMsg('Password updated.');
  };

  const resetAll = () => {
    if (confirm('This will erase all local data. Continue?')){
      clearAll();
      location.href = '/';
    }
  };

  return (
    <Shell>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-2">Change Password</h2>
          <div className="space-y-3">
            <input className="input" type="password" placeholder="New password" value={p1} onChange={e=>setP1(e.target.value)} />
            <input className="input" type="password" placeholder="Confirm password" value={p2} onChange={e=>setP2(e.target.value)} />
            <button className="btn btn-primary" onClick={changePassword}>Update</button>
            {msg && <div className="text-sm text-green-400">{msg}</div>}
          </div>
        </div>
        <div className="card">
          <h2 className="text-lg font-semibold mb-2">Danger Zone</h2>
          <p className="text-neutral-400 mb-3">Reset all local data and settings.</p>
          <button className="btn" onClick={resetAll}>Reset storage</button>
        </div>
      </div>
    </Shell>
  );
}
