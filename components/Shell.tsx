
'use client';
import Nav from './Nav';
import { ReactNode } from 'react';

export default function Shell({children}:{children:ReactNode}){
  return (
    <div className="min-h-screen">
      <Nav/>
      <main className="container py-6 space-y-6">{children}</main>
      <footer className="border-t border-neutral-800 py-8 mt-10 text-center text-sm text-neutral-400">
        Cashbook • Data stored locally in your browser
      </footer>
    </div>
  );
}
