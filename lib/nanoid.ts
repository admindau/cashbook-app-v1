
export function nanoid(size = 12) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let id = '';
  const cryptoObj = typeof crypto !== 'undefined' ? crypto : null;
  if (cryptoObj && 'getRandomValues' in cryptoObj) {
    const arr = new Uint8Array(size);
    cryptoObj.getRandomValues(arr);
    for (let i=0;i<size;i++) id += chars[arr[i] % chars.length];
    return id;
  }
  for (let i=0;i<size;i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}
