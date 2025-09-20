
import type { Rates } from './types';
export function convert(amount: number, from: 'SSP'|'USD'|'KES', to: 'SSP'|'USD'|'KES', rates: Rates): number {
  if (from === to) return amount;
  // normalize to SSP
  let inSsp = amount;
  if (from === 'USD') inSsp = amount * rates.usd_to_ssp;
  if (from === 'KES') inSsp = amount * rates.kes_to_ssp;
  if (from === 'SSP') inSsp = amount;
  // convert SSP -> target
  if (to === 'USD') return inSsp / rates.usd_to_ssp;
  if (to === 'KES') return inSsp / rates.kes_to_ssp;
  return inSsp; // to SSP
}
