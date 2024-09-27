"use client";
import { MainImage, Property, PropertyLocation } from "@prisma/client";
import clsx from "clsx";
import { CheckCircle, CheckCircle2, Image as LucideImage } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import LoadingButton from "@/components/loading-btn";

interface MyPropertyPageProps {
  myProperty: (Property & {
    LocationDetails: PropertyLocation[];
    MainImage: MainImage[];
  })[];
}
const MyPropertyPage = ({ myProperty }: MyPropertyPageProps) => {
  const router = useRouter();

  return (
    <div>
      <div
        className={clsx(
          "flex flex-nowrap justify-between items-center h-[60px]",
          "border-b border-slate-300"
        )}
      >
        <h1 className={clsx("text-lg font-semibold")}>My Properties</h1>
        <LoadingButton context="List a property" handleClick={ async () => router.push("/partner/property-type")} />
      </div>
      <div className="pt-6 flex space-x-5  overflow-x-scroll">
        {myProperty.length > 0 ? (myProperty.map((prop) => (
          <Link key={prop.id} href={`/partner/my-property/${prop.id}`}>
            <div
              className={clsx(
                "aspect-square w-[200px] rounded-lg overflow-hidden",
                "border border-slate-300 transition-all duration-300",
                "hover:shadow-md"
              )}
            >
              <div className="h-3/5 relative">
                <div className="absolute z-10 right-2 top-2 text-xs font-medium px-1 rounded-full bg-slate-200">
                  {prop.confirmed ? (
                    <p className="flex space-x-1 p-1">
                      <span>verified</span>
                      <span>
                        <CheckCircle2 className="h-4 w-4 text-indigo-500" />
                      </span>
                    </p>
                  ) : (
                    <p className="p-1">unverified</p>
                  )}
                </div>
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
        ))) : (
          <div className="h-[300px] w-full flex justify-center items-center">
            <p>You have no properties listed yet...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPropertyPage;
