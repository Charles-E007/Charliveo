import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('keepalive_session_token')?.value;
  const { pathname } = request.nextUrl;

  // Si l'utilisateur est déjà connecté et tente de se rendre sur login ou register,
  // on le redirige immédiatement vers /dashboard
  if (token && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/register'],
};
