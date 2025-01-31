// app/api-docs/route.ts
import { NextResponse } from 'next/server';
import { createSwaggerSpec } from 'next-swagger-doc';

export async function GET() {
  const spec = createSwaggerSpec({
    apiFolder: 'app/(default)/api',
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Your API Documentation',
        version: '1.0.0',
        description: 'API documentation for your application'
      },
      servers: [
        {
          url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
          description: 'Local server'
        }
      ]
    }
  });
  
  return NextResponse.json(spec);
}