import { db } from "@/lib/db";
import { verifyToken } from "@/utils/jwt";
import { isTokenExpired } from "@/utils/token-validity";
import { parse } from "cookie";
import { NextResponse } from "next/server";

export async function POST(
  req: Request
) {
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

    const decodedToken = await verifyToken(token) as { payload: { email: string } } | string;
    if (!decodedToken) {
      return NextResponse.json({ message: "Invalid anjay" }, { status: 401 });
    }

    let userEmail: string | null = null;
    if (typeof decodedToken === 'object') {
      userEmail = decodedToken.payload.email;
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
    if (user.role === "ADMIN") {
      return NextResponse.json({ message: "Method not allowed" }, { status: 403 })
    }

    const updateUser = await db.user.update({
      where: {
        email: user.email
      },
      data: {
        role: "PARTNER"
      }
    })

    const response = NextResponse.json({ message: "Successfully be a partner" }, { status: 200 });
    return response
  } catch (error) {
    console.log("[ERR_PARTNER_REGISTER]", error)
  }
}