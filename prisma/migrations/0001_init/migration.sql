-- Enable pgcrypto (for gen_random_uuid) — Supabase usually has this enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- User
CREATE TABLE "User" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" TEXT NOT NULL UNIQUE,
  "passwordHash" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Category
CREATE TABLE "Category" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Rates
CREATE TABLE "Rates" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "usdToSsp" DOUBLE PRECISION NOT NULL,
  "kesToSsp" DOUBLE PRECISION NOT NULL,
  "userId" UUID NOT NULL UNIQUE,
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "Rates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Transaction
CREATE TABLE "Transaction" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "type" TEXT NOT NULL,
  "amount" DOUBLE PRECISION NOT NULL,
  "currency" TEXT NOT NULL,
  "date" TIMESTAMPTZ NOT NULL,
  "note" TEXT,
  "userId" UUID NOT NULL,
  "categoryId" UUID NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "Transaction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Seed default categories
INSERT INTO "Category" ("name","type") VALUES
 ('Salary','income'),('Bonus','income'),('Investment','income'),('Gift','income'),
 ('Food','expense'),('Transport','expense'),('Rent','expense'),('Utilities','expense'),
 ('Health','expense'),('Education','expense'),('Leisure','expense');
