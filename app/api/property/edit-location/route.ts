import { db } from "@/lib/db";
import { fetchUserServer } from "@/utils/user";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request
) {
  try {
    const reqHeaders = headers();
    const user = await fetchUserServer(reqHeaders);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    };

    const data = await req.json();
    const { propertyId, ...updateData } = data

    //Find the property that gonna be edited
    const findPropertyLocation = await db.propertyLocation.findUnique({
      where: {
        propertyId: propertyId
      }
    })
    if (!findPropertyLocation) {
      return NextResponse.json({ message: "Property not found" }, { status: 404 });
    }

    const updatePropertyLocation = await db.propertyLocation.update({
      where: {
        id: findPropertyLocation.id
      },
      data: updateData
    });

    const response = NextResponse.json({ message: "success editting property location", updatePropertyLocation }, { status: 200 })
    return response
  } catch (error) {
    console.log("[ERR_EDIT_LOCATION]", error);
  }
}