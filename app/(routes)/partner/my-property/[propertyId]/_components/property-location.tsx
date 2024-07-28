"use client";
import { Property, PropertyLocation } from "@prisma/client";
import clsx from "clsx";
import { Dispatch, SetStateAction, useState } from "react";

import { Pencil, X } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { LeafletMapTsx, LeafletMapView } from "@/components/maps/map";
import { MapLeafletGeocoder } from "@/components/maps/map-with-js";
import Link from "next/link";

interface Coordinates {
  lat: number;
  lng: number;
}

interface PropertyLocationFormProps {
  property: Property;
  propertyLocation: PropertyLocation;
}
const PropertyLocationForm = ({
  property,
  propertyLocation,
}: PropertyLocationFormProps) => {
  const [isEditting, setIsEditting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);

  const router = useRouter();

  //check if theres allready lat and lng on propertyLocation database
  const initialLocation = {
    lat: propertyLocation.latitude || -8.6743,
    lng: propertyLocation.longitude || 115.2041,
  };

  const handleCoordinates: Dispatch<SetStateAction<Coordinates | null>> = (
    coords
  ) => {
    setCoordinates(coords);
    console.log("Selected coordinates:", coords);
    // You can now send these coordinates to your server or handle them as needed
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
        <h1 className="italic font-semibold">Property Location:</h1>
        <button
          onClick={() => setIsEditting((prev) => !prev)}
          className={clsx(
            "flex items-center space-x-1 p-2 shadow rounded",
            "hover:text-slate-600 "
          )}
        >
          {isEditting ? (
            <>
              <X className="h-4 w-4" />
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
          <LeafletMapView lat={initialLocation.lat} lng={initialLocation.lng} />
        ) : (
          <>
            <LeafletMapTsx
              initialLat={initialLocation.lat}
              initialLng={initialLocation.lng}
              setCoordinates={handleCoordinates}
              propertyId={property.id}
            />
            {/* <MapLeafletGeocoder
              initialLat={initialLocation.lat}
              initialLng={initialLocation.lng}
              setCoordinates={handleCoordinates}
              propertyId={property.id}
            /> */}
            <div className={clsx("mt-4", "text-sm text-slate-600")}>
              <p>Click the map to set the coordinates</p>
              {coordinates && (
                <div>
                  <Link
                    target="_blank"
                    href={`https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`}
                  >
                    <p className="text-sky-600 hover:text-sky-500">Open in google map </p>
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PropertyLocationForm;
