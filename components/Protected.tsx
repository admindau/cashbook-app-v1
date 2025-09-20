
'use client';
import { useEffect } from 'react';
import { isSessionActive } from '@/lib/storage';
import { useToast } from './ToastProvider';

export default function Protected({ children }: { children: React.ReactNode }) {
  const toast = useToast();

  useEffect(() => {
    if (!isSessionActive()) {
      toast.show('Please log in first.');
      window.location.href = '/login';
    }
  }, []);

  return <>{children}</>;
}
