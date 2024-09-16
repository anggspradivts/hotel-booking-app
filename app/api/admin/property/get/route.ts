import { fetchUserServer } from "@/utils/user";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const reqHeaders = headers();
    const user = await fetchUserServer(reqHeaders);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ message: "You have no permission" }, { status: 401 })
    };

    

  } catch (error) {
    console.log("[ERR_GET_PROPERTY_ADMIN]", error);
    throw new Error("Internal server error")
  }
}