
'use client';
// Simple local password auth using SHA-256 (client-side).
// Not suitable for multi-user or sensitive data, but perfect for a self-hosted tracker without a backend.
export async function sha256(text: string): Promise<string> {
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  const bytes = Array.from(new Uint8Array(buf));
  return bytes.map(b => b.toString(16).padStart(2,'0')).join('');
}
