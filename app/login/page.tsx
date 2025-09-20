
'use client';
import { useEffect, useState } from 'react';
import Shell from '@/components/Shell';
import Modal from '@/components/Modal';
import { getAuthHash, setAuthHash, getEmail, startSession } from '@/lib/storage';
import { sha256 } from '@/lib/auth';
import { useToast } from '@/components/ToastProvider';
export default function Login(){const [email,setE]=useState('');const [p,setP]=useState('');const [err,setErr]=useState('');const [show,setShow]=useState(false);const toast=useToast();
useEffect(()=>{setE(getEmail()||'');},[]);
const onLogin=async()=>{setErr('');const stored=getEmail();if(!stored||email!==stored)return setErr('Email not found or does not match.');const hash=await sha256(p);if(hash===getAuthHash()){startSession();toast.show('Welcome back!');setTimeout(()=>{location.href='/dashboard';},500);}else setErr('Incorrect password.');};
const onReset=()=>{setAuthHash('');location.href='/';};
return(<Shell><div className="card max-w-md mx-auto text-center"><img src="/logo.png" className="h-16 mx-auto mb-4" alt="logo"/><h1 className="text-xl font-semibold mb-4">Login</h1><input className="input mb-2" placeholder="Email" value={email} onChange={e=>setE(e.target.value)}/><input type="password" className="input mb-2" placeholder="Password" value={p} onChange={e=>setP(e.target.value)}/>{err&&<div className="text-sm text-red-400">{err}</div>}<button className="btn btn-primary mt-2 w-full" onClick={onLogin}>Login</button><button className="text-sm text-blue-400 mt-2 underline" onClick={()=>setShow(true)}>Forgot Password?</button></div><Modal isOpen={show} onClose={()=>setShow(false)} onConfirm={onReset} title="Reset Password?" message="Are you sure you want to reset your password? Your cashbook records and email will remain." confirmText="Reset" cancelText="Cancel" variant="success"/></Shell>);}
