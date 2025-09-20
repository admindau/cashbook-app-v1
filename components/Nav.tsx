
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChartLine, LogOut, List, PlusCircle, Search } from 'lucide-react';
import { clearAuth } from '@/lib/storage';

export default function Nav() {
  const pathname = usePathname();
  return (
    <header className="border-b border-neutral-800 sticky top-0 z-40 bg-black/60">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <img src="/logo.svg" alt="Savvy Gorilla Cashbook Logo" className="h-8 w-auto" />
          <span className="font-semibold text-white">Cashbook</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link href="/dashboard" className="btn"><ChartLine className="h-4 w-4"/> Dashboard</Link>
          <Link href="/transactions" className="btn"><List className="h-4 w-4"/> Transactions</Link>
          <Link href="/add" className="btn"><PlusCircle className="h-4 w-4"/> Add</Link>
          <Link href="/search" className="btn"><Search className="h-4 w-4"/> Search</Link>
          <button className="btn" onClick={() => { clearAuth(); location.href = '/' }}><LogOut className="h-4 w-4"/> Logout</button>
        </nav>
      </div>
    </header>
  );
}
