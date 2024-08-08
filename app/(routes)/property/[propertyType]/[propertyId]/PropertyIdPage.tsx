"use client";
import { MainImage, Property, PropertyImages } from "@prisma/client";
import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface PropertyIdPageProps {
  property: Property & { MainImage: MainImage[]; Images: PropertyImages[] };
}
const PropertyIdPage = ({ property }: PropertyIdPageProps) => {
  const [isShow, setIsShow] = useState<string | null>(null);

  const findMainImg = property.MainImage.find(
    (img) => img.propertyId === property.id
  );

  return (
    <div>
      <h1 className="py-5 font-semibold text-xl border-b vorder-slate-300">
        {property.name}
      </h1>
      <div className="grid md:grid-cols-2">
        <div className="img-container h-[400px] min-w-full">
          <div className="main-img relative h-2/3">
            <Image
              src={findMainImg?.url || ""}
              alt="property-img"
              layout="fill"
            />
          </div>
          <div className="other-img flex h-1/3  w-full overflow-x-scroll">
            {property.Images.map((img) => (
              <div
                key={img.id}
                className="h-full w-[200px] relative flex-shrink-0"
                onClick={() => setIsShow(img.url)}
              >
                <Image
                  src={img.url || ""}
                  alt="property-img"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            ))}
          </div>
        </div>
        {isShow && (
          <div className="absolute flex justify-center bg-black bg-opacity-85 items-center h-screen w-screen top-0 left-0">
            <div className="relative bg-white p-5 w-full  md:p-0 h-[400px] md:w-[600px]">
              <Image
                src={isShow}
                alt="property-img"
                fill
                objectFit="cover"
              />
              <button className="p-2 bg-white absolute top-0 right-0" onClick={() => setIsShow(null)}>
                <X />
              </button>
            </div>
          </div>
        )}
        <div className="details"></div>
      </div>
      <div className="description"></div>
      <div></div>
    </div>
  );
};

export default PropertyIdPage;
