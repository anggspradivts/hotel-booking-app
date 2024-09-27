import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request, 
  { params }: { params: { propertyId: string } }
) {
  try {
    const propertyId = params.propertyId;
    if (!propertyId) {
      return NextResponse.json({ message: "No property id provided" }, { status: 400 });
    };
    
    const getPropertyImage = await db.mainImage.findUnique({
      where: {
        propertyId: propertyId
      }
    });
    const getPropertyLocation = await db.propertyLocation.findUnique({
      where: {
        propertyId: propertyId
      }
    });

    const data = { getPropertyImage, getPropertyLocation };

    if (!getPropertyImage || !getPropertyLocation) {
      return NextResponse.json({ message: "Image or location is not provided in database" }, { status: 400 });
    };

    return NextResponse.json(data);
  } catch (error) {
    console.log("[ERR_GET_PROPERTY_DETAILS_ADMIN]", error);
    return NextResponse.json({ message: "Failed to get property details" }, { status: 400 })
  }
}