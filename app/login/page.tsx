'use client';
import Shell from '@/components/Shell';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ToastProvider';

export default function Login(){
  const [email, setEmail] = useState('');
  const [p, setP] = useState('');
  const [err, setErr] = useState('');
  const toast = useToast();

  useEffect(()=>{
    const uid = localStorage.getItem('cashbook:userId');
    if (uid) location.href='/dashboard';
  },[]);

  const onLogin = async () => {
    setErr('');
    const r = await fetch('/api/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, password: p }) });
    const j = await r.json();
    if (!r.ok) return setErr(j.error || 'Login failed');
    localStorage.setItem('cashbook:userId', j.userId);
    toast.show('Welcome back!');
    setTimeout(()=>location.href='/dashboard', 400);
  };

  return (
    <Shell>
      <div className="card max-w-md mx-auto text-center">
        <img src="/logo.png" className="h-16 mx-auto mb-4" alt="logo" />
        <h1 className="text-xl font-semibold mb-2">Login</h1>
        <input className="input mb-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" className="input mb-2" placeholder="Password" value={p} onChange={e=>setP(e.target.value)} />
        {err && <div className="text-sm text-red-400">{err}</div>}
        <button className="btn btn-primary mt-2 w-full" onClick={onLogin}>Login</button>
      </div>
    </Shell>
  );
}
