import { db } from "@/lib/db";
import { fetchUserServer } from "@/utils/user";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const reqHeaders = headers();
    const user = await fetchUserServer(reqHeaders);

    if(!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json();
    const { roomTypesName, bedTypesName, roomTypesFacilities, roomPrice, propertyId } = data

    const findProperty = await db.property.findUnique({
      where: {
        id: propertyId
      }
    });
    
    //check if property exist
    if (!findProperty) {
      return NextResponse.json({ message: "Property not found" }, { status: 404 })
    };

    //check if the loggedin user is the owner of property
    if (user.userId !== findProperty.OwnerId) {
      return NextResponse.json({ message: "You are not the owner of this property" }, { status: 401 })
    };
    
    const createRoomOption = await db.propertyRoomOption.create({
      data: {
        propertyId: findProperty.id
      }
    });

    console.log("rtName", roomTypesName)

    const createRoomTypes = await db.roomTypes.create({
      data: {
        name: roomTypesName,
        price: roomPrice,
        PropertyRoomOptId: createRoomOption.id
      }
    });

    const createBedTypes = await db.bedTypes.create({
      data: {
        name: bedTypesName,
        RoomTypesId: createRoomTypes.id
      }
    });

    const createRoomFacilities = await db.roomTypesFacilities.create({
      data: {
        name: roomTypesFacilities,
        RoomTypesId: createRoomTypes.id
      }
    });

    const response = NextResponse.json({ message: "Success create property room details!" }, { status: 200 });
    return response;
  } catch (error) {
    console.log("[ERR_CREATE_DETAILS]", error);
    throw new Error("Internal server error")
  }
}