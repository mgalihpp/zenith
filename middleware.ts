import { NextRequest, NextResponse } from 'next/server';
import SessionService from './services/session.service';
export function middleware(req: NextRequest) {
  const cookies = req.cookies;
  const sessionCookie = cookies.get('session')?.value;
  const sessionService = new SessionService();
  if (!req.cookies.has('session')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  const sessionData = sessionService.decrypt(sessionCookie);
  if (!sessionData) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: [
    '/((?!api|session|login|signup|_next/static|_next/image|favicon.ico).*)', // Exclude /api/*, /login, and /signup routes
  ],
};
