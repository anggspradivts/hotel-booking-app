import bcrypt from "bcryptjs";
import { signToken } from "@/utils/jwt";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request
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

    const token = signToken({ email: checkUser.email });
    const name = checkUser.name;
    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.log("[ERR_LOGIN]", error)
  }
}