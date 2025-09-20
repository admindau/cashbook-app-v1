
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChartLine, LogOut, List, PlusCircle, Search, Sun, Moon } from 'lucide-react';
import { clearAuth, getTheme, setTheme, load } from '@/lib/storage';
import { symbolFor } from '@/lib/format';
import { useEffect, useMemo, useState } from 'react';

export default function Nav() {
  const pathname = usePathname();
  const [theme, setThemeState] = useState<'dark'|'light'>(getTheme());
  const [tick, setTick] = useState(0);
  const data = useMemo(()=>load(), [tick]);
  useEffect(()=>{
    const on = () => setTick(x=>x+1);
    window.addEventListener('storage', on);
    return ()=>window.removeEventListener('storage', on);
  },[]);
  const currencyBadge = symbolFor(data.currency);

  useEffect(()=>{
    document.documentElement.classList.toggle('dark', theme==='dark');
    setTheme(theme);
  },[theme]);

  return (
    <header className="border-b border-neutral-800 sticky top-0 z-40 backdrop-blur bg-black/50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <img src="/logo.png" alt="Savvy Rilla Logo" className="h-8 w-auto" />
          <span className="font-semibold text-white">Cashbook</span>
          <span className="badge">{currencyBadge}</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link href="/dashboard" className={tab(pathname === '/dashboard')}><ChartLine className="h-4 w-4"/>Dashboard</Link>
          <Link href="/transactions" className={tab(pathname.startsWith('/transactions'))}><List className="h-4 w-4"/>Transactions</Link>
          <Link href="/add" className={tab(pathname === '/add')}><PlusCircle className="h-4 w-4"/>Add</Link>
          <Link href="/search" className={tab(pathname === '/search')}><Search className="h-4 w-4"/>Search</Link>
          <button aria-label="toggle theme" className="btn" onClick={()=>setThemeState(theme==='dark'?'light':'dark')}>
            {theme==='dark' ? <Sun className="h-4 w-4"/> : <Moon className="h-4 w-4"/>}
          </button>
          <button className="btn" onClick={()=>{ clearAuth(); location.href='/' }}><LogOut className="h-4 w-4"/>Logout</button>
        </nav>
      </div>
    </header>
  );
}
function tab(active: boolean){ return `btn ${active ? 'bg-white text-black' : ''}`; }
