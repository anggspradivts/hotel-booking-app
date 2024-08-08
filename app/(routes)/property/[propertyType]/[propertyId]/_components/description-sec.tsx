"use client";
import { MainImage, Property, PropertyImages } from "@prisma/client";
import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface DescriptionSecPageProps {
  property: Property;
}
const DescriptionSecPage = ({ property }: DescriptionSecPageProps) => {

  return (
    <div className="space-y-5 md:min-h-[300px]">
      <h1 className="py-5 font-semibold text-xl border-b vorder-slate-300">
        About this property
      </h1>
      <div className="description ">
        {property.description || "No description was provided in this property"}
      </div>
    </div>
  );
};

export default DescriptionSecPage;
