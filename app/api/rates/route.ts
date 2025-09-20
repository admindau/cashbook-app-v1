import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request){
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId')!;
  const r = await prisma.rates.findUnique({ where: { userId } });
  return NextResponse.json(r);
}

export async function PUT(req: Request){
  const { userId, usdToSsp, kesToSsp } = await req.json();
  const r = await prisma.rates.upsert({ where: { userId }, update: { usdToSsp, kesToSsp }, create: { userId, usdToSsp, kesToSsp } });
  return NextResponse.json(r);
}
