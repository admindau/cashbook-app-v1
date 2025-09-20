'use client';
import { useEffect, useState } from 'react';
import Shell from '@/components/Shell';
import { getAuthHash, setAuthHash } from '@/lib/storage';
import { sha256 } from '@/lib/auth';
export default function Home(){
  const [mode,setMode]=useState<'login'|'setup'>('setup');
  const [p1,setP1]=useState('');
  const [p2,setP2]=useState('');
  const [error,setError]=useState('');
  useEffect(()=>{ setMode(getAuthHash()?'login':'setup'); },[]);
  const onSetup=async()=>{
    setError('');
    if(p1.length<4) return setError('Use at least 4 characters.');
    if(p1!==p2) return setError('Passwords do not match.');
    setAuthHash(await sha256(p1));
    location.href='/dashboard';
  };
  return (<Shell>
    <div className="card max-w-md mx-auto text-center">
      <img src="/logo.png" alt="Savvy Rilla Logo" className="h-16 mx-auto mb-4"/>
      <h1 className="text-2xl font-semibold mb-4">Create your password</h1>
      {mode==='setup'?<div className="space-y-3">
        <input type="password" className="input" placeholder="Password" value={p1} onChange={e=>setP1(e.target.value)}/>
        <input type="password" className="input" placeholder="Confirm password" value={p2} onChange={e=>setP2(e.target.value)}/>
        {error && <div className="text-sm text-red-400">{error}</div>}
        <button className="btn btn-primary w-full mt-2" onClick={onSetup}>Sign up</button>
      </div>:<p>Account already exists on this device. Please <a className="underline" href="/login">login</a>.</p>}
    </div>
  </Shell>);
}
