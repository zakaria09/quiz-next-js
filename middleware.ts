import {NextResponse} from 'next/server';
import {getSession} from 'next-auth/react';

export async function middleware(req) {
  const session = await getSession({req});

  // Restrict access to /dashboard and /admin unless the user is logged in
  const url = req.url;

  if ((url.includes('/quiz-dashboard') || url.includes('/admin')) && !session) {
    // Redirect user to login page if not authenticated
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  // Allow access if authenticated
  return NextResponse.next();
}

export const config = {
  matcher: ['/quiz-dashboard/:path*', '/admin/:path*'], // Apply middleware to these routes
};
