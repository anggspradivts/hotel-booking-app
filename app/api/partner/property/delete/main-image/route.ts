import { db } from "@/lib/db";
import { fetchUserServer } from "@/utils/user";

import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

export async function DELETE(
  req: Request
) {
  try {
    const reqHeaders = headers();
    const utapi = new UTApi();

    const data = await req.json();
    const { key, url, propertyId } = data;

    const user = await fetchUserServer(reqHeaders)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    };

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
    
    if (key) {
      const findOldImg = await db.mainImage.findFirst({
        where: {
          propertyId
        }
      })

      if (!findOldImg) {
        return NextResponse.json({ message: "Image not found" }, { status: 404 });
      }

      if (findOldImg.key) {
        // Ensure that key is not null before attempting to delete the file
        const deleteFromUt = await utapi.deleteFiles(findOldImg.key); // Wrap in an array to match the expected type
        if (deleteFromUt.success) {
          // Handle success case if needed
          console.log("File deleted successfully from UploadThing");
        } else {
          // Handle failure case if needed
          console.log("Failed to delete file from UploadThing");
        }
      } else {
        return NextResponse.json({ message: "Image key is null, cannot delete" }, { status: 400 });
      }
      const deleteFromDb = await db.mainImage.delete({
        where: {
          propertyId: propertyId
        }
      });
      return NextResponse.json({ message: "Success  deleting image" }, { status: 200 })

    } else {
      return NextResponse.json({ message: "Failed  deleting image" }, { status: 500 })
    }
  } catch (error) {
    console.log("[ERR_DELETE_MAIN_IMAGE]", error)
  }
}