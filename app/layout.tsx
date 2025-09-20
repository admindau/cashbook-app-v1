
import './globals.css';
import type { Metadata } from 'next';
import ToastProvider from '@/components/ToastProvider';
export const metadata: Metadata = { title: 'Cashbook', description: 'Cashbook tracker' };
export default function RootLayout({children}:{children:React.ReactNode}){
  return (<html lang="en" suppressHydrationWarning><body className="antialiased"><ToastProvider>{children}</ToastProvider></body></html>);
}
