import {NextResponse} from 'next/server';
import {getToken} from 'next-auth/jwt';

export async function middleware(req) {
  // Restrict access to /dashboard and /admin unless the user is logged in
  const url = req.url;
  const token = await getToken({req, secret: process.env.NEXTAUTH_SECRET});

  console.log('token', token);

  if (url.includes('/quiz-dashboard')) {
    // Redirect user to login page if not authenticated
    if (!token) {
      return NextResponse.redirect(new URL('/signin', url));
    }
  }

  // Allow access if authenticated
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/quiz-dashboard/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
