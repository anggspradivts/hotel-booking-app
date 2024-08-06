import { fetchUserServer } from "@/utils/user";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const reqHeaders = headers()
    const user = await fetchUserServer(reqHeaders);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" })
    }

    const data = await req.json();
    console.log(data)
  } catch (error) {
    console.log("[ERR_DELETE_PROPERTY]")
  }
}