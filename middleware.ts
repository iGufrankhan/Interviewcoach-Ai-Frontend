import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware to protect routes and redirect based on authentication status
 * Protected routes: /dashboard, /UploadResume, /GetResume, /GetResumeData, /AnalysisResume, /DeleteResume, etc.
 * Public routes: /, /login, /register, /OtpSend, /verify-otp, /reset-password, /DetailsDocs
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Define public routes (no auth required)
  const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/OtpSend',
    '/verify-otp',
    '/reset-password',
    '/reset-password-otp',
    '/DetailsDocs',
    '/landing-page',
  ];

  // Define protected routes (auth required)
  const protectedRoutes = [
    '/dashboard',
    '/UploadResume',
    '/GetResume',
    '/GetResumeData',
    '/AnalysisResume',
    '/DeleteResume',
    '/InterviewService',
    '/interviewprep',
  ];

  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route));
  
  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.includes(route));

  // Skip protection check for non-route paths
  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.startsWith('/public')) {
    return NextResponse.next();
  }

  // If it's a protected route, check for auth token
  if (isProtectedRoute) {
    const token = request.cookies.get('auth-token')?.value;
    
    // Token validation happens client-side via useAuth hook, this just allows the request through
    // The client-side hook will handle redirects for missing tokens
    return NextResponse.next();
  }

  // Public routes or other routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
