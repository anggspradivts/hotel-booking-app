"use client";
import { Property } from "@prisma/client";
import clsx from "clsx";
import { useState } from "react";

import { Image, Pencil, X } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  ImageUpload,
  UploadedFile,
} from "@/components/uploadthing/file-upload";

interface PropertyMainImgFormProps {
  property: Property;
}
const PropertyMainImgForm = ({ property }: PropertyMainImgFormProps) => {
  const [isEditting, setIsEditting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleFileUpload = async (res: UploadedFile) => {
    try {
      setIsLoading(true);
      const imgUrl = res[0].url;
      const data = { 
        imgUrl, 
        id: property.id 
      };
      const response = await axios.patch("/api/property/edit", data);
      if (response.status === 200) {
        toast.success("Success edit property image!")
        router.refresh();
      }
      console.log(data);
    } catch (error: any) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      }
    } finally {
      setIsLoading(false);
      setIsEditting(false)
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
          property.imgUrl ? (
            <div
              className={clsx(
                "flex justify-center items-center w-full rounded overflow-hidden",
                "h-[200px] w-auto",
                "bg-slate-300"
              )}
            >
              <img
                className="w-full h-full object-cover"
                src={property.imgUrl}
                alt="property-img"
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
              <Image className="h-6 w-6" />
              <p className="text-sm">No image provided</p>
            </div>
          )
        ) : (
          <ImageUpload handleFileUpload={handleFileUpload} />
        )}
      </div>
    </div>
  );
};

export default PropertyMainImgForm;