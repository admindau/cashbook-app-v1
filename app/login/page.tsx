
'use client';
import { useState } from 'react';
import Shell from '@/components/Shell';
import { getAuthHash } from '@/lib/storage';
import { sha256 } from '@/lib/auth';

export default function LoginPage(){
  const [p, setP] = useState('');
  const [error, setError] = useState('');

  const onLogin = async () => {
    const hash = await sha256(p);
    if (hash === getAuthHash()) {
      location.href = '/dashboard';
    } else {
      setError('Incorrect password.');
    }
  };

  return (
    <Shell>
      <div className="card max-w-md mx-auto text-center">
        <img src="/logo.svg" alt="Savvy Gorilla Cashbook Logo" className="h-16 mx-auto mb-4" />
        <h1 className="text-xl font-semibold mb-4">Login</h1>
        <input type="password" className="input mb-2" placeholder="Password" value={p} onChange={e=>setP(e.target.value)} />
        {error && <div className="text-sm text-red-400">{error}</div>}
        <button className="btn btn-primary mt-2 w-full" onClick={onLogin}>Login</button>
      </div>
    </Shell>
  );
}
