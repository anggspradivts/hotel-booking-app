import { db } from "@/lib/db";
import { fetchUserServer } from "@/utils/user";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(
  req: Request
) {
  try {
    const reqHeaders = headers();
    const user = await fetchUserServer(reqHeaders);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 200 });
    }

    const data = await req.json();
    const { imgUrl, propertyId } = data

    const findProperty = await db.property.findUnique({
      where: {
        id: propertyId
      }
    });

    if (!findProperty) {
      return NextResponse.json({ message: "Property not found" }, { status: 404 });
    };
    if (findProperty.OwnerId !== user.userId) {
      return NextResponse.json({ message: "You are not the owner of this property" }, { status: 401 })
    };

    const createImage = await db.propertyImages.create({
      data: {
        url: imgUrl,
        propertyId: propertyId
      }
    });

    return NextResponse.json({ message: "Image uploaded successfully", createImage }, { status: 200 });
  } catch (error) {
    console.log("[ERR_CREATE_IMAGES]", error);
    throw new Error("Internal server error")
  }
}