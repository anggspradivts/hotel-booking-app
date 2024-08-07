"use client";
import { MainImage, Property, PropertyLocation } from "@prisma/client";
import clsx from "clsx";
import { Image } from "lucide-react";
import Link from "next/link";

interface MyPropertyPageProps {
  myProperty: (Property & { LocationDetails: PropertyLocation[], MainImage: MainImage[] })[];
}
const MyPropertyPage = ({ myProperty }: MyPropertyPageProps) => {
  // const propertyImage = 
  return (
    <>
      {myProperty.map((prop) => (
        <Link key={prop.id} href={`/partner/my-property/${prop.id}`}>
          <div
            className={clsx(
              "h-[270px] w-[300px] rounded-lg overflow-hidden",
              "border border-slate-300 transition-all duration-300",
              "hover:shadow-md"
            )}
          >
            <div className="h-3/5 relative">
              <p className="absolute right-2 top-2 text-xs font-medium px-1 rounded-full bg-slate-200">
                {prop.confirmed ? "verified" : "unverified"}
              </p>
              {prop.MainImage && prop.MainImage.length > 0 && prop.MainImage[0].url ? (
                <img
                  className="w-full h-full object-cover"
                  src={prop.MainImage[0].url || ""}
                  alt="property-img"
                />
              ) : (
                <div className="bg-slate-300 w-full h-full flex justify-center items-center">
                  <Image className="h-6 w-6" />
                </div>
              )}
            </div>
            <div className="h-2/5 p-2 text-sm">
              <h1 className="font-semibold">{prop.name}</h1>
              <ul>
                {prop.LocationDetails &&
                  Array.isArray(prop.LocationDetails) &&
                  prop.LocationDetails.map((loc) => (
                    <li className="text-xs" key={loc.id}>
                      {loc.country ? (
                        <>
                          {loc.county}, {loc.state}, {loc.country}
                        </>
                      ) : (
                        <>No Location was set</>
                      )}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
};

export default MyPropertyPage;
