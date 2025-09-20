'use client';
import { usePathname } from 'next/navigation';
import { LineChart, LogOut, List, PlusCircle, Search, Settings } from 'lucide-react';

function tab(active: boolean){ return `btn ${active ? 'bg-white text-black' : ''}`; }

export default function Nav(){
  const pathname = usePathname();
  return (
    <header className="border-b border-neutral-800 sticky top-0 z-40 backdrop-blur bg-black/50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <a href="/dashboard" className="flex items-center gap-2">
          <img src="/logo.png" className="h-8 w-auto" alt="logo" />
          <span className="font-semibold">Cashbook</span>
        </a>
        <nav className="flex items-center gap-2">
          <a href="/dashboard" className={tab(pathname === '/dashboard')}><LineChart className="h-4 w-4" />Dashboard</a>
          <a href="/transactions" className={tab((pathname||'').startsWith('/transactions'))}><List className="h-4 w-4" />Transactions</a>
          <a href="/add" className={tab(pathname === '/add')}><PlusCircle className="h-4 w-4" />Add</a>
          <a href="/search" className={tab(pathname === '/search')}><Search className="h-4 w-4" />Search</a>
          <a href="/settings" className={tab(pathname === '/settings')}><Settings className="h-4 w-4" />Settings</a>
          <button className="btn" onClick={()=>{ localStorage.removeItem('cashbook:userId'); location.href='/login'; }}><LogOut className="h-4 w-4" />Logout</button>
        </nav>
      </div>
    </header>
  );
}
