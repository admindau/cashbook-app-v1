'use client';
import { createContext, useContext, useState, useCallback } from 'react';
import Toast from './Toast';

type ToastItem = { id: string; message: string };
type Ctx = { show: (message: string) => void };

const Ctx = createContext<Ctx>({ show: () => {} });
export const useToast = () => useContext(Ctx);

export default function ToastProvider({ children }: { children: React.ReactNode }){
  const [items, setItems] = useState<ToastItem[]>([]);
  const show = useCallback((m: string) => {
    const id = Math.random().toString(36).slice(2);
    setItems(t => [...t, { id, message: m }]);
    setTimeout(() => setItems(t => t.filter(x => x.id !== id)), 3000);
  }, []);
  return (
    <Ctx.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
        {items.map(t => <Toast key={t.id} message={t.message} />)}
      </div>
    </Ctx.Provider>
  );
}
