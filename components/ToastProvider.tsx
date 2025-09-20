
'use client';
import { createContext, useContext, useState, useCallback } from 'react';
import Toast from './Toast';

type ToastItem = { id: string; message: string; };
type Ctx = { show: (message: string) => void; };

const ToastCtx = createContext<Ctx>({ show: () => {} });
export function useToast(){ return useContext(ToastCtx); }

export default function ToastProvider({ children }: { children: React.ReactNode }){
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const show = useCallback((message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, { id, message }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  }, []);

  return (
    <ToastCtx.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
        {toasts.map(t => <Toast key={t.id} message={t.message} />)}
      </div>
    </ToastCtx.Provider>
  );
}
