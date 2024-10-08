"use client";
import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
import { useEffect } from "react";
import toast from "react-hot-toast";

export type UploadedFile = {
  customId: string | null;
  key: string;
  name: string;
  serverData: { uploadedBy: string };
  size: number;
  type: string;
  url: string;
}[]

interface ImageUploadProps {
  handleFileUpload: (res: UploadedFile) => void;
}
export const PropertyMainImageUpload = ({ handleFileUpload }: ImageUploadProps) => {
  return (
    <UploadDropzone
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        // Do something with the response
        handleFileUpload(res);
      }}
      onUploadError={(error: Error) => {
        // Do something with the error.
        toast.error(`ERROR! ${error.message}`);
      }}
    />
  );
};

export const PropertyImagesUpload = ({ handleFileUpload }: ImageUploadProps) => {
  return (
    <UploadDropzone
      endpoint="imageUploader"
      appearance={{
        label: "hidden",
      }}
      className="h-full w-full mt-0 rounded-none"
      onClientUploadComplete={(res) => {
        // Do something with the response
        handleFileUpload(res);
      }}
      onUploadError={(error: Error) => {
        // Do something with the error.
        toast.error(`ERROR! ${error.message}`);
      }}
    />
  );
};