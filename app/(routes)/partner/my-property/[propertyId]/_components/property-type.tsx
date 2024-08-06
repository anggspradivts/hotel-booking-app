"use client";
import React, { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Property, PropertyType } from "@prisma/client";
import clsx from "clsx";

import { Pencil, X } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  PropertyType: z.string(),
  id: z.string(),
});

interface PropertyTypeFormProps {
  property: Property;
  propertyType: PropertyType[];
}
const PropertyTypeForm = ({
  property,
  propertyType,
}: PropertyTypeFormProps) => {
  const [isEditting, setIsEditting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      PropertyType: property.PropertyType,
      id: property.id,
    },
  });
  const { handleSubmit, getValues, register } = form;
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const res = await axios.patch("/api/partner/property/edit", data);
      if (res.status === 200) {
        toast.success(res.data.message);
        router.refresh();
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
      setIsEditting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue("PropertyType", e.target.value);
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
        <h1 className="italic font-semibold">Property Type:</h1>
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
        <div className="flex justify-between items-center"></div>
        {!isEditting ? (
          <div
            className={clsx(
              "flex justify-between items-center w-full py-2",
              ""
            )}
          >
            <p className="text-sm">
              {/* uppercase the first alphabet */}
              {property.PropertyType.charAt(0).toUpperCase() +
                property.PropertyType.slice(1)}
            </p>
          </div>
        ) : (
          <form
            name="name"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            {propertyType.map((type) => (
              <div key={type.id} className="flex items-center w-full space-x-2">
                <input
                  type="radio"
                  name="propertyType"
                  value={type.name}
                  onChange={handleChange}
                  className={clsx("px-3")}
                />
                <p className="text-md">
                  {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
                </p>
              </div>
            ))}
            <div className="flex justify-end">
              <button
                className={clsx("p-2 shadow rounded", "hover:text-slate-600 ")}
                type="submit"
                disabled={isSubmitting || !isValid}
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PropertyTypeForm;
