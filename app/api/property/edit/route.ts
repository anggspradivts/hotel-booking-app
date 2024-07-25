import { db } from "@/lib/db";
import { fetchUserServer } from "@/utils/user";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { object } from "zod";

export async function PATCH(
  req: Request
) {
  try {
    const reqHeaders = headers();
    const user = await fetchUserServer(reqHeaders)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    //Incoming data from client
    const data = await req.json();
    const { name, id } = data;

    const findProperty = await db.property.findUnique({
      where: {
        id: id
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
 
    const updateproperty = await db.property.update({
      where: {
        id: findProperty.id
      },
      data: data
    });

    const response = NextResponse.json({ message: "Success updating property", updateproperty }, { status: 200 });
    return response;
  } catch (error) {
    console.log("[ERR_EDIT_PROPERTY]", error);
    throw new Error("Internal server error")
  }
}