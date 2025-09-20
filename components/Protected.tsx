'use client';
import { useEffect } from 'react';
export default function Protected({ children }: { children: React.ReactNode }){
  useEffect(() => {
    const uid = localStorage.getItem('cashbook:userId');
    if (!uid) window.location.href = '/login';
  }, []);
  return <>{children}</>;
}
