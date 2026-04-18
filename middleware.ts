import { NextRequest, NextResponse } from 'next/server';

// Minimal middleware - just pass through all requests
// Route protection is handled client-side via useAuth hook
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
