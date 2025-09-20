'use client';
import { CheckCircle } from 'lucide-react';
export default function Toast({ message }: { message: string }){
  return (
    <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-700 text-white rounded-xl px-3 py-2 shadow-lg">
      <CheckCircle className="h-5 w-5 text-green-500" />
      <span className="text-sm">{message}</span>
    </div>
  );
}
