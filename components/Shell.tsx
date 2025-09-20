
'use client';
import { ReactNode } from 'react';
import Nav from './Nav';

export default function Shell({children}:{children:ReactNode}){
  return (
    <div className="min-h-screen flex flex-col">
      <Nav/>
      <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
      <footer className="border-t border-neutral-800 text-center py-6 text-sm text-neutral-400 flex items-center justify-center gap-2">
        <img src="/logo.png" alt="Savvy Rilla Logo" className="h-4" />
        Cashbook • Savvy Gorilla
      </footer>
    </div>
  );
}
