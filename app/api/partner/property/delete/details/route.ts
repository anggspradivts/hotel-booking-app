import { db } from "@/lib/db";
import { fetchUserServer } from "@/utils/user";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const reqHeaders = headers()
    const user = await fetchUserServer(reqHeaders);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" })
    }

    const data = await req.json();
    const { propertyId, roomOptId } = data;

    const findProperty = await db.property.findUnique({
      where: {
        id: propertyId
      }
    })
    const findRoomOption = await db.propertyRoomOption.findUnique({
      where: {
        id: roomOptId
      }
    })
    if (!findProperty ) {
      return NextResponse.json({ message: "Property or room property not found" }, { status: 404 })
    } else if (!findRoomOption) {
      return NextResponse.json({ message: "Room property not found" }, { status: 404 })
    }

    if (findProperty.OwnerId !== user.userId) {
      return NextResponse.json({ message: "You are not the owner of this property" }, { status: 401 })
    }

    console.log("anjay")
    
    const deleteRoomOption = await db.propertyRoomOption.delete({
      where: {
        id: roomOptId
      }
    })

    const response = NextResponse.json({ message: "Success deleting room option" }, { status: 200 });
    return response;
  } catch (error) {
    console.log("[ERR_DELETE_PROPERTY]", error)
  }
}