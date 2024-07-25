import { db } from "@/lib/db";
import { parse } from "cookie";
import { NextResponse } from "next/server";
import { fetchUserServer } from "@/utils/user";
import { headers } from "next/headers";

export async function POST(
  req: Request
) {
  try {
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

    //Create two data, create property and create property location
    const createProperty = await db.property.create({
      data: {
        PropertyType: searchType.name,
        OwnerId: userId
      }
    });
    const createPropertyLocation = await db.propertyLocation.create({
      data: {
        propertyId: createProperty.id
      }
    });

    const response = NextResponse.json({ message: "Success creating property", createProperty }, { status: 200 });
    return response
  } catch (error) {
    console.log("[ERR_CREATE_PROPERTY]", error)
    throw new Error("Internal server error")
  }
}