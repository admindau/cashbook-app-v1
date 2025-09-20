
'use client';
import { useEffect, useState } from 'react';
import Shell from '@/components/Shell';
import { getAuthHash, setAuthHash } from '@/lib/storage';
import { sha256 } from '@/lib/auth';
import Link from 'next/link';

export default function Home() {
  const [mode, setMode] = useState<'login'|'setup'>('setup');
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setMode(getAuthHash() ? 'login' : 'setup');
  }, []);

  const onSetup = async () => {
    if (p1.length < 4) return setError('Use at least 4 characters.');
    if (p1 !== p2) return setError('Passwords do not match.');
    setAuthHash(await sha256(p1));
    location.href = '/dashboard';
  };

  const onLogin = async () => {
    const hash = await sha256(p1);
    if (hash === getAuthHash()) location.href = '/dashboard';
    else setError('Incorrect password.');
  };

  return (
    <Shell>
      <div className="card max-w-md mx-auto text-center">
        <img src="/logo.svg" alt="Savvy Gorilla Cashbook Logo" className="h-16 mx-auto mb-4" />
        <h1 className="text-2xl font-semibold mb-4">{mode === 'login' ? 'Welcome back' : 'Set a password'}</h1>
        <div className="space-y-3">
          <input type="password" className="input" placeholder="Password" value={p1} onChange={e=>setP1(e.target.value)} />
          {mode==='setup' && <input type="password" className="input" placeholder="Confirm password" value={p2} onChange={e=>setP2(e.target.value)} />}
          {error && <div className="text-sm text-red-400">{error}</div>}
          <div className="flex gap-2 pt-2">
            {mode==='login'
              ? <button className="btn btn-primary w-full" onClick={onLogin}>Login</button>
              : <button className="btn btn-primary w-full" onClick={onSetup}>Create Password</button>}
          </div>
        </div>
        <p className="text-xs text-neutral-400 mt-4">Powered by <Link href="https://savvygorilla.tech" className="underline">Savvy Gorilla</Link></p>
      </div>
    </Shell>
  );
}
