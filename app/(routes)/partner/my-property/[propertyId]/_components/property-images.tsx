"use client"
import { PropertyImagesUpload, UploadedFile } from "@/components/uploadthing/file-upload";
import { Property, PropertyImages } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface PropertyImagesProps {
  property: Property & { Images: PropertyImages[] };
}
const PropertyImagesPage = ({ property }: PropertyImagesProps) => {
  const router = useRouter();
  const handleFileUpload = async (res: UploadedFile) => {
    try {
      const imgUrl = res[0].url;
      const data = { imgUrl, propertyId: property.id }
      const response = await axios.post("/api/partner/property/create/property-images", data);
      if (response.status === 200) {
        toast.success("Image uploaded successfully");
        router.refresh()
      }
    } catch (error: any) {
      if(error.response && error.response.data) {
        console.log(error.response.data);
        toast.error("Something went wrong!")
      }
    }
  }

  return (
    <div className="space-y-5">
      <div className="header">
        <h2 className="text-lg font-semibold">Property Images</h2>
      </div>
      <div className="images-container grid grid-cols-2 md:grid-cols-4 ">
        {property.Images.length > 0 && property.Images.map((prop) => (
          <div key={prop.id} className="h-[210px] overflow-hidden">
            <img src={prop.url || ""} alt="property-img" className="h-full w-full object-cover" />
          </div>
        ))}
        <div className="h-[210px]">
          <PropertyImagesUpload handleFileUpload={handleFileUpload} />
        </div>
      </div>
    </div>
  );
};

export default PropertyImagesPage;
