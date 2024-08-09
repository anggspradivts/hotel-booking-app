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

    const data = await req.json();
    const { name, id } = data

    const findProperty = await db.property.findUnique({
      where: {
        id: id
      }
    })
    if (!findProperty) {
      return NextResponse.json({ message: "Property not found" }, { status: 404 })
    }

    if (findProperty.OwnerId !== user.userId) {
      return NextResponse.json({ message: "You are not the owner of this property" }, { status: 401 })
    }

    //Create two data, create property and create property location
    const createPropertyFacilities = await db.propertyMainFacilities.create({
      data: {
        name: name,
        propertyId: id
      }
    });

    const response = NextResponse.json({ message: "Success creating property" }, { status: 200 });
    return response
  } catch (error) {
    console.log("[ERR_CREATE_PROPERTY]", error)
    throw new Error("Internal server error")
  }
}