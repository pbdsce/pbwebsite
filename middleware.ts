import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { logInfo } from '@/lib/logger';

export function middleware(request: NextRequest) {
  // Log the incoming request
  if (typeof process.env.NEXT_RUNTIME === 'string') {
    logInfo(`Request received: ${request.method} ${request.nextUrl.pathname}`, {
      'http.method': request.method,
      'http.url': request.nextUrl.pathname,
      'http.user_agent': request.headers.get('user-agent') || 'unknown',
    });
  }
  
  // Your existing API docs handling
  if (request.nextUrl.pathname === '/api/docs') {
    return NextResponse.next({
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }
  
  // Your existing OPTIONS handling
  if (request.method === 'OPTIONS') {
    return NextResponse.json({}, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    });
  }
  
  return NextResponse.next();
}

// Update the matcher to include both your API routes and other pages
export const config = {
  matcher: [
    '/api/:path*',
    '/api/docs',
    // Add more paths if you want to log other routes
    // '/((?!_next/static|_next/image|favicon.ico|images/).*)',
  ]
};