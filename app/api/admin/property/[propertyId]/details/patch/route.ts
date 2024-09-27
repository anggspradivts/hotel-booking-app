import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const data = await req.json();
    const { id, name, confirmed } = data;

    const property = await db.property.findUnique({
      where: { id },
    });
    if (!property) {
      return NextResponse.json({ message: "Property not found" }, { status: 401 })
    }

    const updatedProperty = await db.property.update({
      where: {
        id: property.id
      },
      data
    });

    return NextResponse.json({ message: "Success update property as admin", updatedProperty }, { status: 200 })
  } catch (error) {
    console.log("[ERR_PATCH_PROPERTY_DETAILS_ADMIN]", error);
    return NextResponse.json({ message: "Error edit property details" }, { status: 500 })
  }
}
