import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(){
  const cats = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  const income = cats.filter(c=>c.type==='income');
  const expense = cats.filter(c=>c.type==='expense');
  return NextResponse.json({ income, expense });
}

export async function POST(req: Request){
  const { name, type } = await req.json();
  if (!name || !type) return NextResponse.json({ error: 'Missing' }, { status: 400 });
  const c = await prisma.category.create({ data: { name, type } });
  return NextResponse.json(c);
}
