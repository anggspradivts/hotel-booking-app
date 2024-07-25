import { db } from "@/lib/db";
import { parse } from "cookie";
import { NextResponse } from "next/server";
import { fetchUserServer } from "@/utils/user";
import { headers } from "next/headers";

export async function POST(
  req: Request
) {
  try {
    // const cookies = req.headers.get("cookie") || "";
    // const res = await fetch("http://localhost:3000/api/auth/user", {
    //   method: "GET",
    //   headers: {
    //     "Cookie": cookies
    //   }
    // });

    const reqHeaders = headers();
    const user = await fetchUserServer(reqHeaders);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // const userData = await res.json();
    const { name, message } = user;

    if (!name) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    };

    const data = await req.json();
    const { propertyType, userId } = data

    const searchType = await db.propertyType.findFirst({
      where: {
        name: propertyType
      }
    });

    if(!searchType) {
      return NextResponse.json({ message: "Property type not found" }, { status: 404 })
    }

    const createProperty = await db.property.create({
      data: {
        PropertyType: searchType.name,
        OwnerId: userId
      }
    });

    const response = NextResponse.json({ message: "Success creating property", createProperty }, { status: 200 });
    return response
  } catch (error) {
    console.log("[ERR_CREATE_PROPERTY]", error)
    throw new Error("Internal server error")
  }
}