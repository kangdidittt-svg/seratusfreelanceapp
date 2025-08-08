import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple JWT verification for Edge Runtime
function verifyTokenInMiddleware(token: string): any {
  try {
    // For Edge Runtime, we'll do basic token structure validation
    // and let the API routes handle full verification
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    // Decode payload (basic validation)
    const payload = JSON.parse(atob(parts[1]));
    
    // Check if token is expired
    if (payload.exp && payload.exp < Date.now() / 1000) {
      return null;
    }
    
    return payload;
  } catch (error) {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  const publicPaths = ['/api/auth/login', '/api/auth/setup'];
  
  // Check if the current path is public
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
  
  // If it's a public path, allow access
  if (isPublicPath) {
    return NextResponse.next();
  }

  // For API routes (except public ones), check authentication
  if (pathname.startsWith('/api/')) {
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = verifyTokenInMiddleware(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    return NextResponse.next();
  }

  // For the root path and dashboard routes
  if (pathname === '/' || pathname.startsWith('/dashboard')) {
    if (!token) {
      // If no token, redirect to login (which will be handled by the main page)
      return NextResponse.next();
    }

    const decoded = verifyTokenInMiddleware(token);
    if (!decoded) {
      // If invalid token, clear it and redirect to login
      const response = NextResponse.next();
      response.cookies.set('auth-token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0
      });
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};