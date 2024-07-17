import { serialize } from "cookie";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const serializedCookie = serialize('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0), // Set the cookie to expire in the past
      path: '/',
    });
  
    const response = new NextResponse(JSON.stringify({ message: "Logged out" }), { status: 200 });
    response.headers.set('Set-Cookie', serializedCookie);
    
    return response;
  } catch (error) {
    console.log("[ERR_LOGOUT]", error);
  }
}