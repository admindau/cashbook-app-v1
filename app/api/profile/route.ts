import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sha256 } from '@/lib/crypto';

export async function GET(req: Request){
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId')!;
  const u = await prisma.user.findUnique({ where: { id: userId } });
  return NextResponse.json({ email: u?.email || '' });
}

export async function PUT(req: Request){
  const { userId, email, currentPassword, newPassword } = await req.json();
  if (email) await prisma.user.update({ where: { id: userId }, data: { email } });
  if (currentPassword && newPassword){
    const u = await prisma.user.findUnique({ where: { id: userId } });
    if (!u || u.passwordHash !== sha256(currentPassword)) return NextResponse.json({ error: 'Incorrect current password' }, { status: 400 });
    await prisma.user.update({ where: { id: userId }, data: { passwordHash: sha256(newPassword) } });
  }
  return NextResponse.json({ ok: true });
}
