
import type { Rates } from './types';
export function convert(amount: number, from: 'SSP'|'USD'|'KES', to: 'SSP'|'USD'|'KES', rates: Rates): number {
  if (!Number.isFinite(amount)) return 0;
  if (from === to) return amount;
  let inSsp = amount;
  if (from === 'USD') inSsp = amount * rates.usd_to_ssp;
  if (from === 'KES') inSsp = amount * rates.kes_to_ssp;
  if (to === 'USD') return inSsp / rates.usd_to_ssp;
  if (to === 'KES') return inSsp / rates.kes_to_ssp;
  return inSsp; // to SSP
}
