
export const currencySymbols: Record<string,string> = { SSP:'SS£', KES:'KSh', USD:'$' };
export function symbolFor(currency: string): string {
  return currencySymbols[currency] || currency;
}
export function formatCurrency(amount: number, currency: string): string {
  const sym = symbolFor(currency);
  return `${sym} ${Number(amount).toLocaleString(undefined,{ maximumFractionDigits: 2 })}`;
}
