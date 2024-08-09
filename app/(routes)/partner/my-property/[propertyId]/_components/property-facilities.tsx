"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Property, PropertyMainFacilities } from "@prisma/client";
import clsx from "clsx";
import { useState } from "react";

import { Pencil, X } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string(),
  id: z.string(),
});

interface PropertyFacilitiesFormProps {
  property: Property & { Facilities: PropertyMainFacilities[] };
}
const PropertyFacilitiesForm = ({ property }: PropertyFacilitiesFormProps) => {
  const [isEditting, setIsEditting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      id: property.id,
    },
  });
  const { handleSubmit, getValues, register } = form;
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const res = await axios.post(
        "/api/partner/property/create/facilities",
        data
      );
      if (res.status === 200) {
        toast.success("Property name updated successfully");
        router.refresh();
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
      setIsEditting(false);
    }
  };

  const handleDelete = async (facilityId: string, propertyId: string) => {
    try {
      const data = { facilityId, propertyId };
      const res = await axios.delete(
        "/api/partner/property/delete/facilities",
        {
          data: data,
        }
      );
      toast.success("Property facility deleted");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
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
        <h1 className="italic font-semibold">Property Main Facilities:</h1>
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
          <div className={clsx("flex flex-wrap space-x-2", "text-sm")}>
            {property.Facilities.length > 0 ? (
              property.Facilities.map((facility) => (
                <p
                  key={facility.id}
                  className="text-sm p-2 mb-2 bg-slate-200 rounded-full"
                >
                  {facility.name}
                </p>
              ))
            ) : (
              <p>No facilities provided yet</p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <h1>Delete facility: </h1>
            <div className={clsx("flex flex-wrap items-center space-x-2", "text-sm")}>
              {property.Facilities.length > 0 ? (
                property.Facilities.map((facility) => (
                  <p
                    key={facility.id}
                    className="flex space-x-1 mb-2 text-sm p-2 bg-slate-200 rounded-full"
                  >
                    <span>{facility.name}</span>
                    <button
                      onClick={() => handleDelete(facility.id, property.id)}
                      className="hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </p>
                ))
              ) : (
                <p>No facilities provided yet</p>
              )}
            </div>
            <form
              name="name"
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-2"
            >
              <h1>Add new facility:</h1>
              <input
                {...register("name")}
                type="text"
                defaultValue={getValues("name")}
                placeholder="facilities name, e.g, swimming pool, smoking area, etc."
                className={clsx(
                  "w-full px-3 py-2",
                  "border border-slate-300 rounded-lg"
                )}
              />
              <div className="flex justify-end">
                <button
                  className={clsx(
                    "p-2 shadow rounded",
                    "hover:text-slate-600 "
                  )}
                  type="submit"
                  disabled={isSubmitting || !isValid}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyFacilitiesForm;
