import bcrypt from "bcryptjs";
import { signToken } from "@/utils/jwt";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST(
  req: Request,
) {
  try {
    const { email, password } = await req.json();

    const checkUser = await db.user.findUnique({
      where: {
        email: email,
      }
    });

    if (!checkUser || !(await bcrypt.compare(password, checkUser.password))) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    const token = await signToken({ email: checkUser.email, role: checkUser.role });

    const serializedCookie = serialize('token', token, {
      httpOnly: true, //token is not accessible from client side if "true"
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400,
      path: '/'
    });

    const response = NextResponse.json({ message: "Success authenticated" }, { status: 200 });
    response.headers.set('Set-Cookie', serializedCookie);

    return response;
  } catch (error) {
    console.log("[ERR_LOGIN]", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}