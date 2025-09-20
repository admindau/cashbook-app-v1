'use client';
import { useEffect, useState } from 'react';
import Shell from '@/components/Shell';
import Modal from '@/components/Modal';
import { getAuthHash, setAuthHash } from '@/lib/storage';
import { sha256 } from '@/lib/auth';
export default function LoginPage(){
  const [p,setP]=useState('');
  const [error,setError]=useState('');
  const [showModal,setShowModal]=useState(false);
  const [hasPassword,setHasPassword]=useState(false);
  useEffect(()=>{ setHasPassword(!!getAuthHash()); },[]);
  const onLogin=async()=>{
    const hash=await sha256(p);
    if(hash===getAuthHash()) location.href='/dashboard';
    else setError('Incorrect password.');
  };
  const onReset=()=>{ setAuthHash(''); location.href='/'; };
  return (<Shell>
    <div className="card max-w-md mx-auto text-center">
      <img src="/logo.png" alt="Savvy Rilla Logo" className="h-16 mx-auto mb-4"/>
      <h1 className="text-xl font-semibold mb-4">Login</h1>
      {hasPassword? <>
        <input type="password" className="input mb-2" placeholder="Password" value={p} onChange={e=>setP(e.target.value)}/>
        {error && <div className="text-sm text-red-400">{error}</div>}
        <button className="btn btn-primary mt-2 w-full" onClick={onLogin}>Login</button>
        <button className="text-sm text-blue-400 mt-2 underline" onClick={()=>setShowModal(true)}>Forgot Password?</button>
      </> : <p>No account found. Please <a href="/" className="underline">Sign up</a>.</p>}
    </div>
    <Modal isOpen={showModal} onClose={()=>setShowModal(false)} onConfirm={onReset} title="Reset Password?" message="Are you sure you want to reset your password? Your cashbook records will remain safe." confirmText="Reset" cancelText="Cancel" variant="success"/>
  </Shell>);
}
