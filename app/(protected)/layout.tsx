
'use client';
import { useEffect } from 'react';
import { getAuthHash } from '@/lib/storage';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  useEffect(()=>{
    if (!getAuthHash()) location.href = '/';
  },[]);
  return <>{children}</>;
}
