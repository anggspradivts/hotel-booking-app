import { NextResponse, NextRequest } from 'next/server';
import { adminPageMiddleware } from './middleware/admin-page';
import { adminRoutesApiMiddleware } from './middleware/admin-routes-api';

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
  ], // Apply this middleware to all /admin routes
};
