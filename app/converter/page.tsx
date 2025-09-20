
'use client';
import Shell from '@/components/Shell';
import { load } from '@/lib/storage';
import { convert } from '@/lib/rates';
import { symbolFor } from '@/lib/format';
import { useMemo, useState } from 'react';
import type { Cur } from '@/lib/types';

export default function ConverterPage(){
  const data = useMemo(()=>load(), []);
  const [amount, setAmount] = useState<number>(0);
  const [from, setFrom] = useState<Cur>('SSP');
  const [to, setTo] = useState<Cur>('USD');

  const result = convert(amount || 0, from, to, data.rates);
  const rateUsd = data.rates.usd_to_ssp;
  const rateKes = data.rates.kes_to_ssp;

  return (
    <Shell>
      <div className="flex items-center gap-2 mb-6">
        <img src="/logo.png" alt="Savvy Rilla Logo" className="h-8" />
        <h2 className="text-lg font-semibold">Currency Converter</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <div className="grid gap-3">
            <label className="block">
              <span className="text-sm text-neutral-300">Amount</span>
              <input className="input mt-1" type="number" value={amount} onChange={e=>setAmount(parseFloat(e.target.value||'0'))}/>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-sm text-neutral-300">From</span>
                <select className="input mt-1" value={from} onChange={e=>setFrom(e.target.value as Cur)}>
                  <option value="SSP">SSP ({symbolFor('SSP')})</option>
                  <option value="USD">USD ({symbolFor('USD')})</option>
                  <option value="KES">KES ({symbolFor('KES')})</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm text-neutral-300">To</span>
                <select className="input mt-1" value={to} onChange={e=>setTo(e.target.value as Cur)}>
                  <option value="SSP">SSP ({symbolFor('SSP')})</option>
                  <option value="USD">USD ({symbolFor('USD')})</option>
                  <option value="KES">KES ({symbolFor('KES')})</option>
                </select>
              </label>
            </div>
            <div className="mt-2 text-lg font-semibold">
              Result: {Number.isFinite(result) ? `${symbolFor(to)} ${result.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : '-'}
            </div>
          </div>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Current Rates</h3>
          <ul className="text-sm text-neutral-300 space-y-1">
            <li>1 USD = {rateUsd} SSP</li>
            <li>1 KES = {rateKes} SSP</li>
          </ul>
          <p className="text-neutral-500 text-xs mt-3">Update these in Settings → Currency Exchange Rates.</p>
        </div>
      </div>
    </Shell>
  );
}
