"use client";
import { MainImage, Property } from "@prisma/client";
import clsx from "clsx";
import { useState } from "react";

import { Image as LucideImage, Pencil, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  PropertyMainImageUpload,
  UploadedFile,
} from "@/components/uploadthing/file-upload";
import { revalidatePath } from "next/cache";
import Image from "next/image";

interface PropertyMainImgFormProps {
  property: Property & { MainImage: MainImage[] };
}
const PropertyMainImgForm = ({ property }: PropertyMainImgFormProps) => {
  const [isEditting, setIsEditting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const imgData = property.MainImage[0] || null

  const handleFileUpload = async (res: UploadedFile) => {
    try {
      setIsLoading(true);
      const utRes = res[0]; //uploadthing response when uploading image
      const { key, url } = utRes
      const data = {
        key,
        url,
        propertyId: property.id,
      };
      const response = await axios.post("/api/partner/property/create/main-image", data);
      if (response.status === 200) {
        toast.success("Success edit property image!");
        router.refresh();
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      }
    } finally {
      setIsLoading(false);
      setIsEditting(false);
    }
  };

  return (
    <div
      className={clsx(
        "my-5 p-5 space-y-5",
        "border border-slate-300 rounded-xl",
        {
          "border-2": isEditting,
        }
      )}
    >
      <div className="flex justify-between items-center ">
        <h1 className="italic font-semibold">Property Main Image</h1>
        <button
          onClick={() => setIsEditting((prev) => !prev)}
          className={clsx(
            "flex items-center space-x-1 p-2 shadow rounded",
            "hover:text-slate-600 "
          )}
          disabled={isLoading}
        >
          {isEditting ? (
            <>
              <X className="h-4 w-4" />
              <p>Cancel</p>
            </>
          ) : (
            <>
              <Pencil className="h-4 w-4" />
              <p>Edit</p>
            </>
          )}
        </button>
      </div>
      <div>
        {!isEditting ? (
          property.MainImage.length > 0 ? (
            <div
              className={clsx(
                "flex justify-center items-center w-full rounded overflow-hidden",
                "h-[200px] relative",
                "bg-slate-300"
              )}
            >
              <Image
                className="w-full h-full object-cover"
                src={imgData.url || ""}
                alt="property-img"
                layout="fill"
              />
            </div>
          ) : (
            <div
              className={clsx(
                "flex flex-col justify-center items-center w-full py-2 rounded",
                "h-[200px] w-full space-y-3",
                "bg-slate-300"
              )}
            >
              <LucideImage className="h-6 w-6" />
              <p className="text-sm">No image provided</p>
            </div>
          )
        ) : (
          <PropertyMainImageUpload handleFileUpload={handleFileUpload} />
        )}
      </div>
    </div>
  );
};

export default PropertyMainImgForm;
