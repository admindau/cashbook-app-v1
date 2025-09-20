'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChartLine, LogOut, List, PlusCircle, Search, Calculator } from 'lucide-react';
import { clearAuth } from '@/lib/storage';
export default function Nav(){
  const pathname = usePathname();
  return (
    <header className="border-b border-neutral-800 sticky top-0 z-40 backdrop-blur bg-black/50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <img src="/logo.png" alt="Savvy Rilla Logo" className="h-8 w-auto"/>
          <span className="font-semibold text-white">Cashbook</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link href="/dashboard" className={tab(pathname==='\x2Fdashboard')}><ChartLine className="h-4 w-4"/>Dashboard</Link>
          <Link href="/transactions" className={tab(pathname.startsWith('\x2Ftransactions'))}><List className="h-4 w-4"/>Transactions</Link>
          <Link href="/add" className={tab(pathname==='\x2Fadd')}><PlusCircle className="h-4 w-4"/>Add</Link>
          <Link href="/search" className={tab(pathname==='\x2Fsearch')}><Search className="h-4 w-4"/>Search</Link>
          <Link href="/converter" className="btn" title="Converter" aria-label="Converter"><Calculator className="h-4 w-4"/></Link>
          <button className="btn" onClick={()=>{ clearAuth(); location.href='\x2F' }}><LogOut className="h-4 w-4"/>Logout</button>
        </nav>
      </div>
    </header>
  );
}
function tab(active:boolean){return `btn ${active?'bg-white text-black':''}`}
