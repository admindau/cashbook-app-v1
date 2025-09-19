
'use client';
import { useEffect, useState } from 'react';
import Shell from '@/components/Shell';
import { getAuthHash, setAuthHash } from '@/lib/storage';
import { sha256 } from '@/lib/auth';
import Link from 'next/link';

export default function Home() {
  const [hasPassword, setHasPassword] = useState<boolean>(false);
  const [mode, setMode] = useState<'login'|'setup'>('login');
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setHasPassword(!!getAuthHash());
    setMode(getAuthHash() ? 'login' : 'setup');
  }, []);

  const onSetup = async () => {
    setError('');
    if (p1.length < 4) return setError('Use at least 4 characters.');
    if (p1 !== p2) return setError('Passwords do not match.');
    setAuthHash(await sha256(p1));
    location.href = '/dashboard';
  };

  const onLogin = async () => {
    setError('');
    const hash = await sha256(p1);
    if (hash === getAuthHash()) {
      location.href = '/dashboard';
    } else {
      setError('Incorrect password.');
    }
  };

  return (
    <Shell>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h1 className="text-2xl font-semibold mb-2">{mode==='login'?'Welcome back':'Set a password'}</h1>
          <p className="text-neutral-400 mb-6">
            {mode==='login'
              ? 'Enter your password to access your cashbook.'
              : 'This protects your data on this device. You can change it later by resetting storage.'}
          </p>
          <div className="space-y-3">
            <label className="block">
              <span className="text-sm text-neutral-300">Password</span>
              <input type="password" className="input mt-1" value={p1} onChange={e=>setP1(e.target.value)} placeholder="••••••••"/>
            </label>
            {mode==='setup' && (
              <label className="block">
                <span className="text-sm text-neutral-300">Confirm Password</span>
                <input type="password" className="input mt-1" value={p2} onChange={e=>setP2(e.target.value)} placeholder="••••••••"/>
              </label>
            )}
            {error && <div className="text-sm text-red-400">{error}</div>}
            <div className="flex gap-2 pt-2">
              {mode==='login'
                ? <button className="btn btn-primary" onClick={onLogin}>Login</button>
                : <button className="btn btn-primary" onClick={onSetup}>Create Password</button>}
            </div>
          </div>
        </div>
        <div className="card">
          <h2 className="text-xl font-semibold mb-2">What you get</h2>
          <ul className="list-disc pl-5 space-y-2 text-neutral-300">
            <li>Track income and expenses</li>
            <li>Modern charts & dashboard</li>
            <li>Search & filters</li>
            <li>CSV export</li>
            <li>Local-only data (no server)</li>
          </ul>
          <div className="mt-6">
            <Link href="/dashboard" className="link">Preview the Dashboard</Link> <span className="text-neutral-500">(requires login)</span>
          </div>
        </div>
      </div>
    </Shell>
  );
}
