
'use client';
import { useEffect, useState } from 'react';
import Shell from '@/components/Shell';
import { getAuthHash, setAuthHash, getEmail, setEmail, startSession } from '@/lib/storage';
import { sha256 } from '@/lib/auth';
import { useToast } from '@/components/ToastProvider';
export default function Home(){const [hasAuth,setHas]=useState(false);const [email,setE]=useState(getEmail()||'');const [p1,setP1]=useState('');const [p2,setP2]=useState('');const [err,setErr]=useState('');const toast=useToast();
useEffect(()=>{setHas(!!getAuthHash());},[]);
const onSetup=async()=>{setErr('');if(!email||!email.includes('@'))return setErr('Enter a valid email.');if(p1.length<4)return setErr('Use at least 4 characters.');if(p1!==p2)return setErr('Passwords do not match.');setEmail(email);setAuthHash(await sha256(p1));startSession();toast.show('Account created successfully.');setTimeout(()=>{location.href='/dashboard';},500);};
return(<Shell><div className="card max-w-md mx-auto text-center"><img src="/logo.png" className="h-16 mx-auto mb-4" alt="logo"/><h1 className="text-2xl font-semibold mb-4">Create your account</h1>{hasAuth?(<p>Account already exists. Please <a className="link" href="/login">login</a>.</p>):(<div className="space-y-3"><input className="input" placeholder="Email" value={email} onChange={e=>setE(e.target.value)}/><input type="password" className="input" placeholder="Password" value={p1} onChange={e=>setP1(e.target.value)}/><input type="password" className="input" placeholder="Confirm password" value={p2} onChange={e=>setP2(e.target.value)}/>{err&&<div className="text-sm text-red-400">{err}</div>}<button className="btn btn-primary w-full mt-2" onClick={onSetup}>Sign up</button><div className="text-sm text-neutral-400">Already have an account? <a className="link" href="/login">Login</a></div></div>)}</div></Shell>);}
