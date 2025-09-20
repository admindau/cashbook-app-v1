
export const currencySymbols:Record<string,string>={SSP:'SS£',KES:'KSh',USD:'$'};
export function symbolFor(c:string){return currencySymbols[c]||c;}
export function formatCurrency(amount:number,currency:string){return `${symbolFor(currency)} ${Number(amount).toLocaleString(undefined,{maximumFractionDigits:2})}`;}
