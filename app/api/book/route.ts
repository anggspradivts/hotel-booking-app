import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const completeData = await req.json();
    const createUserBookData = await db.tempUserBookData.create({
      data: completeData
    })
    return NextResponse.json({ message: "Success create data", createUserBookData }, { status: 200 })
  } catch (error) {
    console.log("[ERR_POST_USERDETAILS_BOOK]", error);
    throw new Error("Internal server error")
  }
}