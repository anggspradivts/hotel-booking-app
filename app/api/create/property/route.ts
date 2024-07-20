import { db } from "@/lib/db";
import { parse } from "cookie";
import { NextResponse } from "next/server";

export async function POST(
  req: Request
) {
  try {
    const cookies = parse(req.headers.get("cookie") || (""));
    const token = cookies.token;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    };

    const data = await req.json();

    const searchType = await db.propertyType.findFirst({
      where: {
        name: data
      }
    });

    if(!searchType) {
      return NextResponse.json({ message: "Property type not found" }, { status: 401 })
    }

    const createProperty = await db.property.create({
      data: {
        PropertyTypeId: searchType.id
      }
    });

    const response = NextResponse.json({ message: "Success createing property", createProperty }, { status: 200 });
    return response
  } catch (error) {
    console.log("[ERR_CREATE_PROPERTY]", error)
  }
}