import { db } from "@/lib/db";
import { fetchUserServer } from "@/utils/user";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const reqHeaders = headers();
    const user = await fetchUserServer(reqHeaders);

    if(!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json();
    const { 
      roomTypesName,
      roomTypesId,
      bedTypesName,
      bedTypesId,
      roomTypesFacilities,
      roomFacilitiesId,
      propertyId, 
      roomOptId,
      roomPrice,
    } = data;

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

    const findRoomOption = await db.propertyRoomOption.findUnique({
      where: {
        id: roomOptId
      }
    })
    if(!findRoomOption) return NextResponse.json({ message: "Room option not found" }, { status: 404 })
    
    if (roomTypesName) {
      await db.roomTypes.update({
        where: {
          id: roomTypesId
        },
        data: {
          name: roomTypesName,
        }
      });
    }

    if (roomPrice) {
      await db.roomTypes.update({
        where: {
          id: roomTypesId
        },
        data: {
          price: roomPrice,
        }
      });
    }

    if (bedTypesName) {
      await db.bedTypes.update({
        where: {
          id: bedTypesId
        },
        data: {
          name: bedTypesName
        }
      })
    }

    if (roomTypesFacilities) {
      await db.roomTypesFacilities.update({
        where: {
          id: roomFacilitiesId
        },
        data: {
          name: roomTypesFacilities
        }
      })
    }

    const response = NextResponse.json({ message: "Success create property room details!" }, { status: 200 });
    return response;
  } catch (error) {
    console.log("[ERR_CREATE_DETAILS]", error);
    throw new Error("Internal server error")
  }
}