import { NextResponse, NextRequest } from 'next/server';
import { parse } from 'cookie';
import { verifyToken } from '@/utils/jwt';

export async function middleware(req: NextRequest) {
  const cookies = parse(req.headers.get('cookie') || '');
  const token = cookies.token;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const decodedToken = await verifyToken(token) as { role: string };

  if (!decodedToken || decodedToken.role !== 'ADMIN') {
    const url = req.nextUrl.clone();
    url.pathname = '/forbidden';
    url.searchParams.set('message', 'You do not have permission to access this page');
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'], // Apply this middleware to all /admin routes
};
