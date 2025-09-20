
'use client';
import Shell from '@/components/Shell';

export default function SettingsPage() {
  return (
    <Shell>
      
<div className="flex items-center gap-2 mb-6">
  <img src="/logo.svg" alt="Savvy Gorilla Cashbook Logo" className="h-8" />
  <h2 className="text-lg font-semibold">Savvy Gorilla</h2>
</div>

      <div className="card">Settings content here</div>
    </Shell>
  );
}
