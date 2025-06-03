import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // You can add custom logic for API routes here if needed
  if (request.nextUrl.pathname.startsWith('/api')) {
    // Custom logic for API routes (logging, headers, etc.)
  }
  
  return response;
}