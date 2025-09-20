
'use client';
import { usePathname } from 'next/navigation';
import { ChartLine, LogOut, List, PlusCircle, Search, Settings } from 'lucide-react';
import { endSession, isSessionActive } from '@/lib/storage';
import { useToast } from './ToastProvider';

function tab(active: boolean){ return `btn ${active ? 'bg-white text-black' : ''}`; }

export default function Nav() {
  const pathname = usePathname();
  const toast = useToast();

  const safeNav = (href: string) => {
    if (!isSessionActive()) {
      toast.show('Please log in first.');
      location.href = '/login';
    } else {
      location.href = href;
    }
  };

  return (
    <header className="border-b border-neutral-800 sticky top-0 z-40 backdrop-blur bg-black/50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <button onClick={() => safeNav('/dashboard')} className="flex items-center gap-2">
          <img src="/logo.png" alt="Savvy Rilla Logo" className="h-8 w-auto" />
          <span className="font-semibold text-white">Cashbook</span>
        </button>
        <nav className="flex items-center gap-2">
          <button onClick={()=>safeNav('/dashboard')} className={tab(pathname === '/dashboard')}><ChartLine className="h-4 w-4"/>Dashboard</button>
          <button onClick={()=>safeNav('/transactions')} className={tab(pathname.startsWith('/transactions'))}><List className="h-4 w-4"/>Transactions</button>
          <button onClick={()=>safeNav('/add')} className={tab(pathname === '/add')}><PlusCircle className="h-4 w-4"/>Add</button>
          <button onClick={()=>safeNav('/search')} className={tab(pathname === '/search')}><Search className="h-4 w-4"/>Search</button>
          <button onClick={()=>safeNav('/settings')} className={tab(pathname === '/settings')}><Settings className="h-4 w-4"/>Settings</button>
          <button className="btn" onClick={()=>{ endSession(); location.href='/login'; }}><LogOut className="h-4 w-4"/>Logout</button>
        </nav>
      </div>
    </header>
  );
}
