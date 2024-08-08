"use client";
import { LeafletMapView } from "@/components/maps/map";
import {
  MainImage,
  Property,
  PropertyImages,
  PropertyLocation,
} from "@prisma/client";
import { MapPin, User, UserCircle, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ImageSecPageProps {
  property: Property & {
    MainImage: MainImage[];
    Images: PropertyImages[];
    LocationDetails: PropertyLocation[];
  };
}
const ImageSecPage = ({ property }: ImageSecPageProps) => {
  const [isShow, setIsShow] = useState<string | null>(null);
  const [isMapView, setIsMapView] = useState(false);

  const findMainImg = property.MainImage.find(
    (img) => img.propertyId === property.id
  );

  const propertyLocation =
    property.LocationDetails &&
    property.LocationDetails.find((location) => location);

  const propertyLat: number = propertyLocation!.latitude!;
  const propertyLng: number = propertyLocation!.longitude!;

  useEffect(() => {
    if (isShow) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isShow]);

  return (
    <div className="">
      <h1 className="py-5 font-semibold text-3xl text-indigo-600">{property.name}</h1>
      <div className="grid md:grid-cols-2 gap-5">
        <div className="img-container h-[400px] min-w-full">
          <div className="main-img relative h-2/3">
            <Image
              src={findMainImg?.url || ""}
              alt="property-img"
              layout="fill"
              objectFit="cover"
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
            {isShow && (
              <div className="fixed flex justify-center bg-black bg-opacity-85 items-center h-screen w-screen top-0 bottom-0 right-0 left-0 z-50">
                <div className="relative bg-white p-5 w-full  md:p-0 h-[400px] md:w-[600px]">
                  <Image
                    src={isShow}
                    alt="property-img"
                    fill
                    objectFit="cover"
                  />
                  <button
                    className="p-2 bg-white absolute top-0 right-0"
                    onClick={() => setIsShow(null)}
                  >
                    <X />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="location flex flex-col justify-center md:justify-start gap-5">
          <div className="flex justify-between">
            <div className="flex space-x-3">
              <span>
                <MapPin />
              </span>
              <p className="flex space-x-4">
                {propertyLocation?.county}, {propertyLocation?.state},{" "}
                {propertyLocation?.country}
              </p>
            </div>
            <button
              onClick={() => setIsMapView(true)}
              className="px-2 bg-indigo-300 rounded"
            >
              view map
            </button>
          </div>
          <div className="w-full h-[200px]">
            {!isShow && !isMapView && (
              <LeafletMapView
                lat={propertyLat}
                lng={propertyLng}
                style={{ height: "100%", width: "100%" }}
              />
            )}
          </div>
          {isMapView && (
            <div className="fixed flex justify-center items-center h-screen w-screen bg-black bg-opacity-85 top-0 bottom-0 left-0 right-0">
              <button
                onClick={() => setIsMapView(false)}
                className="fixed top-5 right-10 bg-white"
              >
                <X />
              </button>
              <LeafletMapView
                lat={propertyLat}
                lng={propertyLng}
                style={{ height: "80%", width: "80%" }}
              />
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            <div className="rating border border-slate-300 h-[120px] rounded-lg flex justify-center items-center">
              Rating: 9.8
            </div>
            <div className="review border border-indigo-300 h-[120px] rounded-lg">
              <div className="flex items-center space-x-2 p-1 border-b border-slate-300">
                <UserCircle />
                <h1 className="text-xs overflow-auto">User</h1>
              </div>
              <div className="overflow-auto text-xs p-1">
                {/* Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit
                ad ab voluptatum, minima odio tempore error sequi rerum. Ducimus
                aperiam doloremque repellat laborum rerum dicta odio dolores
                quas tenetur quaerat! */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageSecPage;
