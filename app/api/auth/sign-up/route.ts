"use server"
import bcrypt from "bcryptjs";
import { signToken } from "@/utils/jwt";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { serialize } from "cookie";

export async function POST(
  req: Request
) {
  try {
    const { email, password, name } = await req.json();

    //Check if the user alleady exist on database
    const checkUser = await db.user.findUnique({
      where: {
        email,
      }
    });
    if (checkUser) return NextResponse.json({ message: "This acccount is allready signed up" }, { status: 405 })
    
    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
  
    //create a user on database
    const createUser = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });

    const token = signToken({ email: createUser.email })

    const serializedCookie = serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600,
      path: '/'
    });

    const response = NextResponse.json({ message: "Successfully signed up", token: token }, { status: 200 });
    response.headers.set('Set-Cookie', serializedCookie); //set the token on cookie

    return response;
  } catch (error) {
    console.log("[ERR_SIGNUP]", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}