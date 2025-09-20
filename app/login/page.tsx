
'use client';
import { useEffect, useState } from 'react';
import Shell from '@/components/Shell';
import Modal from '@/components/Modal';
import { getAuthHash, setAuthHash, getEmail, startSession } from '@/lib/storage';
import { sha256 } from '@/lib/auth';
import { useToast } from '@/components/ToastProvider';

export default function LoginPage(){
  const [email, setEmailState] = useState<string>('');
  const [p, setP] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const toast = useToast();

  useEffect(()=>{ setEmailState(getEmail() || ''); }, []);

  const onLogin = async () => {
    setError('');
    const storedEmail = getEmail();
    if (!storedEmail || email !== storedEmail) return setError('Email not found or does not match.');
    const hash = await sha256(p);
    if (hash === getAuthHash()) {
      startSession();
      toast.show('Welcome back!');
      setTimeout(() => { location.href = '/dashboard'; }, 500);
    } else setError('Incorrect password.');
  };

  const onReset = () => {
    setAuthHash('');
    location.href = '/';
  };

  return (
    <Shell>
      <div className="card max-w-md mx-auto text-center">
        <img src="/logo.png" alt="Savvy Rilla Logo" className="h-16 mx-auto mb-4" />
        <h1 className="text-xl font-semibold mb-4">Login</h1>
        <input className="input mb-2" placeholder="Email" value={email} onChange={e=>setEmailState(e.target.value)} />
        <input type="password" className="input mb-2" placeholder="Password" value={p} onChange={e=>setP(e.target.value)} />
        {error && <div className="text-sm text-red-400">{error}</div>}
        <button className="btn btn-primary mt-2 w-full" onClick={onLogin}>Login</button>
        <button className="text-sm text-blue-400 mt-2 underline" onClick={()=>setShowModal(true)}>Forgot Password?</button>
      </div>
      <Modal
        isOpen={showModal}
        onClose={()=>setShowModal(false)}
        onConfirm={onReset}
        title="Reset Password?"
        message="Are you sure you want to reset your password? Your cashbook records and email will remain."
        confirmText="Reset"
        cancelText="Cancel"
        variant="success"
      />
    </Shell>
  );
}
