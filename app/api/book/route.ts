import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const completeData = await req.json();
    const { 
      firstName, 
      lastName, 
      fulName, 
      email, 
      phoneNumber, 
      checkin, 
      checkout, 
      roomId,
      propertyId
    } = completeData;

    const findProperty = await db.property.findUnique({
      where: {
        id: propertyId
      }
    });
    const findRoom = await db.roomTypes.findUnique({
      where: {
        id: roomId
      }
    });
    if (!findProperty && !findRoom) {
      return NextResponse.json({ message: "Data not valid" }, { status: 401 })
    };

    const userOrderData = await db.tempUserBookData.create({
      data: completeData
    })
    return NextResponse.json({ message: "Success create data", userOrderData }, { status: 200 })
  } catch (error) {
    console.log("[ERR_POST_USERDETAILS_BOOK]", error);
    throw new Error("Internal server error")
  }
}