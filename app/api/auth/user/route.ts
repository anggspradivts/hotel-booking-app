import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/jwt";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = verifyToken(token) as { email: string } | string;

    // console.log("decode", decodedToken)
    if (!decodedToken) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    let userEmail: string | null = null;

    if (typeof decodedToken === 'object' && decodedToken.email) {
      userEmail = decodedToken.email;
    }

    if (!userEmail) {
      return 
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
