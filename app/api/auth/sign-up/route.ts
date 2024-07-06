"use server"
import bcrypt from "bcryptjs";
import { signToken } from "@/utils/jwt";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

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
    if (checkUser) return NextResponse.json({ message: "This acccount is allready signed up" }, { status: 409 })
    
    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const createUser = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });

    const token = signToken({ email: createUser.email })
    return NextResponse.json(( token ), { status: 201 })

  } catch (error) {
    console.log("[ERR_SIGNUP]", error)
  }
}