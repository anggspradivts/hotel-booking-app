import { verifyToken } from "@/utils/jwt";
import { parse } from "cookie";
import { NextRequest, NextResponse } from "next/server";

export async function adminPageMiddleware(req: NextRequest) {
  const cookies = parse(req.headers.get('cookie') || '');
  const token = cookies.token;

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = '/sign-in'; // Path to your login page
    return NextResponse.redirect(url);
  }

  const decodedToken = await verifyToken(token) as { payload: { role: string } };

  if (!decodedToken || decodedToken.payload.role !== 'ADMIN') {
    const url = req.nextUrl.clone();
    url.pathname = '/forbidden';
    url.searchParams.set('message', 'You do not have permission to access this page');
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}