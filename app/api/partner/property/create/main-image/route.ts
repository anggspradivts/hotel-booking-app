import { db } from "@/lib/db";
import { fetchUserServer } from "@/utils/user";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(
  req: Request
) {
  try {
    const reqHeaders = headers();
    const user = await fetchUserServer(reqHeaders);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    const data = await req.json();
    const { key, url, propertyId } = data

    const findProperty = await db.property.findUnique({
      where: {
        id: propertyId
      }
    });

    if (!findProperty) {
      return NextResponse.json({ message: "Property not found" }, { status: 404 });
    };
    if (findProperty.OwnerId !== user.userId) {
      return NextResponse.json({ message: "You are not the owner of this property" }, { status: 401 })
    };

    const findImg = await db.mainImage.findFirst({
      where: {
        propertyId: propertyId
      }
    });

    let response;
    if (findImg) {
      //if image allready exist in database, send delete request to delete image api
      const getCookie = reqHeaders.get("cookie") || ""
      const res = await fetch("http://localhost:3000/api/partner/property/delete/main-image", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Cookie": getCookie
        },
        body: JSON.stringify(data),
        credentials: "include",
      })
      
      if (res.status === 200) { //if the old image success deleted
        const createImage = await db.mainImage.create({
          data: data
        })
        response = NextResponse.json({ message: "Success deleting image" }, { status: 200 })
      } else {
        response = NextResponse.json({ message: "Failed deleting image" }, { status: 500 })
      }
    } else {
      //otherwise create image
      const createImage = await db.mainImage.create({
        data: {
          key: key,
          url: url,
          propertyId: propertyId
        }
      });
      response = NextResponse.json({ message: "Success uploading image" }, { status: 200 });
    }
    
    return response;
  } catch (error) {
    console.log(error)
  }
}