import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/jwt";
import { db } from "@/lib/db";
import { parse, serialize } from "cookie";
import { isTokenExpired } from "@/utils/token-validity";

export async function GET(req: Request) {
  try {
    const cookies = parse(req.headers.get("cookie") || (""));
    const token = cookies.token;
    const tokenExpired = isTokenExpired(token)

    if (!token) {
      return NextResponse.json(
      {
        error: "auth-0001",
        message: "Unauthorized",
        detail: "The token is not existed in the cookies"
      }, { status: 401 })
    }

    const decodedToken = verifyToken(token) as { email: string } | string;
    if (!decodedToken) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    if (tokenExpired) { // Handle if the token expired
      const serializedCookie = serialize('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: new Date(0), // Set the cookie to expire in the past
        path: '/'
      });

      const response = NextResponse.json({ message: 'Token expired' }, { status: 401 });
      response.headers.set('Set-Cookie', serializedCookie);

      return response;
    }
 
    let userEmail: string | null = null;
    if (typeof decodedToken === 'object' && decodedToken.email) {
      userEmail = decodedToken.email;
    }
    if (!userEmail) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    };
    
    const user = await db.user.findUnique({
      where: { 
        email: userEmail
      },
    });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ email: user.email, name: user.name }, { status: 200 });
  } catch (error) {
    console.log("[ERR_FETCH_USER]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
