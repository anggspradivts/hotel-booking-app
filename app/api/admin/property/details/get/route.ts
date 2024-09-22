import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const propertyId = url.searchParams.get("propertyId");
    if (!propertyId) {
      return;
    };
    
    const getPropertyImage = await db.mainImage.findUnique({
      where: {
        propertyId: propertyId
      }
    });
    const getPropertyLocation = await db.propertyLocation.findUnique({
      where: {
        propertyId
      }
    });

    const data = { getPropertyImage, getPropertyLocation };

    if (!getPropertyImage || !getPropertyLocation) {
      return;
    };

    return NextResponse.json(data);
  } catch (error) {
    console.log("[ERR_GET_PROPERTY_DETAILS_ADMIN]", error);
  }
}