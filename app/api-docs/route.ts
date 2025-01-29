// app/api-docs/route.ts
import { NextResponse } from 'next/server';
import { getApiDocs } from '../(default)/api/swagger';

export async function GET() {
  const spec = getApiDocs();
  return NextResponse.json(spec);
}