"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Property } from "@prisma/client";
import clsx from "clsx";
import { ChangeEvent, useState } from "react";

import { Image, Pencil, X } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  imgUrl: z.string(),
  id: z.string(),
});

interface PropertyMainImgFormProps {
  property: Property;
}
const PropertyMainImgForm = ({ property }: PropertyMainImgFormProps) => {
  const [isEditting, setIsEditting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fileState, setFileState] = useState<string | null>(null);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imgUrl: property.name,
      id: property.id,
    },
  });
  const { handleSubmit, register } = form;
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const res = await axios.patch("/api/property/edit", data);
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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const reader = new FileReader();
      const selectedFile = files[0];
      reader.onloadend = () => {
        setFileState(reader.result as string);
      };
      const p = reader.readAsDataURL(selectedFile);
      console.log(selectedFile)
      console.log(p)
      // setFileState(selectedFile);
    }
  };

  console.log(fileState)

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
        <h1 className="italic font-semibold">Property Main Image</h1>
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
          property.imgUrl ? (
            <div
              className={clsx(
                "flex justify-center items-center w-full py-2 rounded",
                "h-[200px] w-auto",
                "bg-slate-300"
              )}
            >
              <img src="" alt="" />
            </div>
          ) : (
            <div
              className={clsx(
                "flex flex-col justify-center items-center w-full py-2 rounded",
                "h-[200px] w-full space-y-3",
                "bg-slate-300"
              )}
            >
              <Image className="h-6 w-6" />
              <p className="text-sm">no image provided</p>
            </div>
          )
        ) : (
          <form
            name="name"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <input
              {...register("imgUrl")}
              type="file"
              onChange={(e) => handleFileChange(e)}
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

export default PropertyMainImgForm;
