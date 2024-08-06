"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Property } from "@prisma/client";
import clsx from "clsx";
import { useState } from "react";

import { Pencil, X } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  description: z.string(),
  id: z.string(),
});

interface PropertyDescriptionFormProps {
  property: Property;
}
const PropertyDescriptionForm = ({
  property,
}: PropertyDescriptionFormProps) => {
  const [isEditting, setIsEditting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: property.description || undefined,
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
        toast.success("Property description updated successfully");
        router.refresh();
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
      setIsEditting(false);
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
        <h1 className="italic font-semibold">Property Description:</h1>
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
              {property.description
                ? property.description
                : "No description provided for this property"}
            </p>
          </div>
        ) : (
          <form
            name="description"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <textarea
              {...register("description")}
              defaultValue={getValues("description")}
              placeholder="your property description"
              className={clsx(
                "w-full px-3 py-2",
                "border border-slate-300 rounded-lg"
              )}
            />
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

export default PropertyDescriptionForm;
