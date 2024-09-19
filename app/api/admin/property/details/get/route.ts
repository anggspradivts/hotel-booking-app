import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const propertyId = url.searchParams.get("propertyId");
    if (!propertyId) {
      return null
    };
    
    const getPropertyImage = await db.mainImage.findUnique({
      where: {
        propertyId: propertyId
      }
    });

    if (!getPropertyImage) {
      return NextResponse.json("")
    }

    return NextResponse.json(getPropertyImage);
  } catch (error) {
    console.log("[ERR_GET_PROPERTY_DETAILS_ADMIN]", error);
  }
}