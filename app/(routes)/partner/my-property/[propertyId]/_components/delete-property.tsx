"use client";
import { Property } from "@prisma/client";
import axios from "axios";
import { Trash2, TriangleAlert, X } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface DeletePropertyBtnProps {
  property: Property;
}
const DeletePropertyBtn = ({ property }: DeletePropertyBtnProps) => {
  const [isShow, setIsShow] = useState(false);

  const router = useRouter();

  const handleDelete = async (propertyId: string) => {
    try {
      const data = { propertyId }
      const res = await axios.delete("/api/partner/property/delete", {
        data: data,
      });
      toast.success("Property deleted!");
      router.push("/partner/my-property")
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  return (
    <div>
      <button
        onClick={() => setIsShow(true)}
        className="flex p-3 space-x-5 rounded-lg text-white bg-red-500"
      >
        <Trash2 />
        <span>Delete this property</span>
      </button>
      {isShow && (
        <div className="fixed flex justify-center items-center inset-0 z-[9999] bg-black bg-opacity-85">
          <div className="flex flex-col items-center justify-center space-y-6 h-1/2 w-full md:w-1/2 rounded-lg bg-white">
            <TriangleAlert className="h-20 w-20" />
            <span className="text-center">
              Are you sure wanted to delete this property, hit continue to
              delete otherwise cancel
            </span>
            <div className="flex space-x-4">
              <button onClick={() => handleDelete(property.id)} className="bg-red-500 p-3 rounded-lg text-white">
                Continue
              </button>
              <button onClick={() => setIsShow(false)} className="p-3 rounded-lg border border-slate-300">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeletePropertyBtn;
