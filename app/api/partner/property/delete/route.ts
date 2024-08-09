import { db } from "@/lib/db";
import { fetchUserServer } from "@/utils/user";
import { headers } from "next/headers"
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request
) {
  try {
    const reqHeaders = headers();
    const user = await fetchUserServer(reqHeaders);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json();
    const { propertyId } = data;

    const findProperty = await db.property.findUnique({
      where: {
        id: propertyId
      }
    });
    if(!findProperty) {
      return NextResponse.json({ message: "Property not found" }, { status: 404 })
    }

    const deleteProperty = await db.property.delete({
      where: {
        id: propertyId
      }
    });

    const response = NextResponse.json({ message: "Success deleting property" }, { status: 200 });
    return response;
  } catch (error) {
    console.log("[ERR_DELETE_PROPERTY]", error);
    throw new Error("Internal server error")
  }
}