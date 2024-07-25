"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Property } from "@prisma/client";
import clsx from "clsx";
import { Dispatch, SetStateAction, useState } from "react";

import { Pencil, X } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { LeafletMapView } from "@/components/maps/map";
import { MapLeafletGeocoder } from "@/components/maps/map-with-js";
import Link from "next/link";

const formSchema = z.object({
  name: z.string(),
  id: z.string(),
});

interface Coordinates {
  lat: number;
  lng: number;
}

interface PropertyLocationFormProps {
  property: Property;
}
const PropertyLocationForm = ({ property }: PropertyLocationFormProps) => {
  const [isEditting, setIsEditting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);

  const router = useRouter();
  const initialLocation = {
    lat: -8.6743,
    lng: 115.2041,
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: property.name,
      id: property.id,
    },
  });
  const { handleSubmit, getValues, register } = form;
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const res = await axios.patch("/api/property/edit", data);
      if (res.status === 200) {
        toast.success("Property location updated successfully");
        router.refresh();
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
      setIsEditting(false);
    }
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
          <LeafletMapView lat={initialLocation.lat} lng={initialLocation.lng} />
        ) : (
          <>
            <MapLeafletGeocoder
              initialLat={initialLocation.lat}
              initialLng={initialLocation.lng}
              setCoordinates={handleCoordinates}
            />
            <div className={clsx("mt-4", "text-sm text-slate-600")}>
              <p>Click the map to set the coordinates</p>
              {coordinates && (
                <div>
                  <p>Selected Latitude: {coordinates.lat}</p>
                  <p>Selected Longitude: {coordinates.lng}</p>
                  <Link
                    target="_blank"
                    href={`https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`}
                  >
                    <p className="hover:text-sky-500">Open in google map </p>
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
