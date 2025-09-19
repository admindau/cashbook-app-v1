
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChartLine, LogOut, CircleDollarSign, List, PlusCircle, Search, Sun, Moon } from 'lucide-react';
import { clearAuth } from '@/lib/storage';
import { useEffect, useState } from 'react';
import { getTheme, setTheme } from '@/lib/storage';

export default function Nav() {
  const pathname = usePathname();
  const [theme, setThemeState] = useState<'dark'|'light'>(getTheme());

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    setTheme(theme);
  }, [theme]);

  return (
    <header className="border-b border-neutral-800 sticky top-0 z-40 backdrop-blur bg-black/50">
      <div className="container flex items-center justify-between h-16">
        <Link href="/dashboard" className="flex items-center gap-2">
          <img src="/logo.svg" alt="logo" className="h-8 w-auto"/>
        </Link>
        <nav className="flex items-center gap-2">
          <Link href="/dashboard" className={tab(pathname==='/dashboard')}><ChartLine className="h-4 w-4"/>Dashboard</Link>
          <Link href="/transactions" className={tab(pathname.startsWith('/transactions'))}><List className="h-4 w-4"/>Transactions</Link>
          <Link href="/add" className={tab(pathname==='/add')}><PlusCircle className="h-4 w-4"/>Add</Link>
          <Link href="/search" className={tab(pathname==='/search')}><Search className="h-4 w-4"/>Search</Link>
          <button aria-label="toggle theme" className="btn" onClick={()=>setThemeState(theme==='dark'?'light':'dark')}>
            {theme==='dark' ? <Sun className="h-4 w-4"/> : <Moon className="h-4 w-4"/>}
          </button>
          <button className="btn" onClick={()=>{ clearAuth(); location.href='/' }}>
            <LogOut className="h-4 w-4"/> Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
function tab(active: boolean) {
  return `btn ${active ? 'bg-white text-black' : ''}`;
}
