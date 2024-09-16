import { NextResponse, NextRequest } from 'next/server';
import { adminPageMiddleware } from './middleware/adminPage';
import { adminRoutesApiMiddleware } from './middleware/adminRoutesApi';

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.pathname;

  if (url.startsWith('/admin')) {
    return adminPageMiddleware(req);
  }

  if (url.startsWith('/api/admin/property')) {
    return adminRoutesApiMiddleware(req);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/property/:path'
  ],
};
