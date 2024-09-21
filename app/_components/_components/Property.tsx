import { MainImage, Property, PropertyLocation } from "@prisma/client";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { Image as LucideImage } from "lucide-react";

interface PropertySecProps {
  property: (Property & {
    LocationDetails: PropertyLocation[];
    MainImage: MainImage[];
  })[];
}
const PropertySec = ({ property }: PropertySecProps) => {
  return (
    <>
      {property.map((prop) => (
        <Link key={prop.id} href={`/property/${prop.PropertyType}/${prop.id}`}>
          <div
            className={clsx(
              "w-full min-w-[180px] md:w-[300px] aspect-[10/9] rounded-lg overflow-hidden",
              // " rounded-lg overflow-hidden",
              "border border-slate-300 transition-all duration-300",
              "hover:shadow-md"
            )}
          >
            <div className="h-3/5 relative">
              {prop.MainImage &&
              prop.MainImage.length > 0 &&
              prop.MainImage[0].url ? (
                <Image
                  className="w-full h-full object-cover"
                  src={prop.MainImage[0].url || ""}
                  alt="property-img"
                  layout="fill"
                />
              ) : (
                <div className="bg-slate-300 w-full h-full flex justify-center items-center">
                  <LucideImage className="h-6 w-6" />
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

export default PropertySec;
